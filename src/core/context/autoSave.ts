import { AppContext, 
    Component, 
    SyncQueue,
    SyncClient,
    ComponentWithSyncTime,
    SetPropsPayload
} from '../types'
import { AnyAction, Dispatch } from '@reduxjs/toolkit'
import { Middleware } from 'redux'
import { add, setProps, remove, syncStatus } from './app'
import { debounce, toLookup } from '../utils'
import { SimpleSyncClient } from '../network'

class AutoSaver{
    syncQueue: SyncQueue
    pendingQueue: SyncQueue
    state: AppContext | null
    syncing: boolean
    client: SyncClient
    constructor(saverClient: SyncClient){
        this.state = null
        this.syncQueue = this.emptyQueue()
        this.pendingQueue = this.emptyQueue()
        this.syncing = false
        this.client = saverClient
    }

    emptyQueue(): SyncQueue{
        return {
            post: new Set<string>(),
            put: new Set<string>(),
            remove: new Set<string>(), 
        }
    }

    switchQueue(){
        this.pendingQueue = this.syncQueue
        this.syncQueue = this.emptyQueue()
    }

    mergePendingToSync(){
        this.syncQueue.post = new Set([...this.syncQueue.post, ...this.pendingQueue.post])
        this.syncQueue.put = new Set([...this.syncQueue.put, ...this.pendingQueue.put])
        this.syncQueue.remove = new Set([...this.syncQueue.remove, ...this.pendingQueue.remove])
        this.pendingQueue.post.clear()
        this.pendingQueue.put.clear()
        this.pendingQueue.remove.clear()
    }

    sync(components: Component[]): Promise<any>{
        this.syncing = true
        const componentToLookup = toLookup(components, c => c.id)
        const componentsNeedSync: ComponentWithSyncTime[] = []
        const {
            post,
            put,
            remove,
        } = this.syncQueue
        const syncTime = (new Date()).getTime()
        put.forEach(id => {
            const c = componentToLookup.get(id)!
            componentsNeedSync.push({...c, syncTime})
        })
        post.forEach(id => {
            const component = componentToLookup.get(id)!
            const parent = componentToLookup.get(component.parent)
            componentsNeedSync.push({...component, syncTime})
            parent && componentsNeedSync.push({...parent, syncTime})
        })

        if(componentsNeedSync.length <= 0 && remove.size <= 0){
            return Promise.resolve()
        }
        this.switchQueue()
        const postRequest = this.client.put("null", componentsNeedSync)
        const removeRequest = this.client.remove("null", Array.from(remove))
        return Promise.allSettled([postRequest, removeRequest])
            .then(([p1, p2]) => {
                let successCount = 0
                if (p1.status === 'fulfilled') {
                    this.pendingQueue.post.clear()
                    this.pendingQueue.put.clear()
                    successCount += 1
                }
                if (p2.status === 'fulfilled') {
                    this.pendingQueue.remove.clear()
                    successCount += 1
                }
                this.mergePendingToSync()
                if (successCount !== 2) {
                    return Promise.reject()
                }
            })
            .finally(() => {
                this.syncing = false
            })
    }


    syncToServer = debounce((state: AppContext, dispatch: Dispatch<AnyAction>) => {
        dispatch(syncStatus('processing'))
        this.sync(state.components)
                .then(status => {
                    dispatch(syncStatus('success'))
                })
                .catch(data => {
                    dispatch(syncStatus('failed'))
                })
    }, 200)

    getMiddleWare(): Middleware<any, any>{
        return ({dispatch, getState}) => {
            return next => action => {
                const res = next(action)
                const state = getState().app.present
                if(action.type === remove.type){
                   action.payload.forEach(this.syncQueue.remove.add)
                }
                console.info(this.syncing)
                if(action.type !== syncStatus.type && this.syncing === false){
                    this.syncToServer(state, dispatch)
                }
                if(action.type === add.type){
                    this.syncQueue.post.add(action.payload.id)
                }else if(action.type === setProps.type){
                    action.payload.forEach((c: SetPropsPayload) => this.syncQueue.put.add(c[0]))
                }
                return res
            }
        }
    }
}

const saver = new AutoSaver(new SimpleSyncClient())
export {
    AutoSaver,
    saver,
}