import { Component, SyncClient } from '../src/core/types'
import { AutoSaver } from '../src/core/context/autoSave'
class MockSyncClient implements SyncClient{
    putSuccess: boolean
    removeSuccess: boolean
    constructor(putSuccess: boolean, removeSuccess:boolean){
        this.putSuccess = putSuccess
        this.removeSuccess = removeSuccess
    }
    put(resumeId: string, components: Component[]): Promise<any> {
        return this.putSuccess ? Promise.resolve() : Promise.reject()
    }
    remove(resumeId: string, ids: string[]): Promise<any> {
        return this.removeSuccess ? Promise.resolve() : Promise.reject()
    }
}

function createMockComponents(): Component[]{
    return [
        {
            id: 'root',
            props: {
                size: [0, 0],
                position: [0, 0],
                layer: 0
            },
            type: 'test',
            children: ["1", "2"],
            parent: ""
        },
        {
            id: '1',
            props: {
                size: [0, 0],
                position: [0, 0],
                layer: 0
            },
            type: 'test',
            children: [],
            parent: "root"     
        },
        {
            id: '2',
            props: {
                size: [0, 0],
                position: [0, 0],
                layer: 0
            },
            type: 'test',
            children: [],
            parent: "root"     
        },
        {
            id: '3',
            props: {
                size: [0, 0],
                position: [0, 0],
                layer: 0
            },
            type: 'test',
            children: [],
            parent: "root"     
        }
    ]
}

function createSaver(putSuccess: boolean=true, removeSuccess: boolean=true): AutoSaver{
    const saver = new AutoSaver(new MockSyncClient(putSuccess, removeSuccess))
    saver.syncQueue.post.add("1")
    saver.syncQueue.put.add("3")
    saver.syncQueue.remove.add("2")
    return saver
}

function nextTask(fun: any){
    setImmediate(fun)
}

test('all success', async () => {
    const saver = createSaver()
    const syncRequest = saver.sync(createMockComponents())
    expect(saver.pendingQueue.post.size).toEqual(1)
    expect(saver.pendingQueue.put.size).toEqual(1)
    expect(saver.pendingQueue.remove.size).toEqual(1)
    expect(saver.syncing).toEqual(true)
    try{
        await syncRequest
        expect(saver.pendingQueue.post.size).toEqual(0)
        expect(saver.pendingQueue.put.size).toEqual(0)
        expect(saver.pendingQueue.remove.size).toEqual(0)

        expect(saver.syncQueue.post.size).toEqual(0)
        expect(saver.syncQueue.put.size).toEqual(0)
        expect(saver.syncQueue.remove.size).toEqual(0)
    }catch(e){
        return Promise.reject()
    }
})


test('put failed', async () => {
    const saver = createSaver(false)
    const syncRequest = saver.sync(createMockComponents())
    try{
        await syncRequest
    }catch(e){
        expect(e).toBeUndefined()
    }
    expect(saver.pendingQueue.post.size).toEqual(0)
    expect(saver.pendingQueue.put.size).toEqual(0)
    expect(saver.pendingQueue.remove.size).toEqual(0)

    expect(saver.syncQueue.post.size).toEqual(1)
    expect(saver.syncQueue.put.size).toEqual(1)
    expect(saver.syncQueue.remove.size).toEqual(0)
    expect(saver.syncing).toBeFalsy()
})

test('delete failed', async () => {
    const saver = createSaver(true, false)
    const syncRequest = saver.sync(createMockComponents())
    try{
        await syncRequest
    }catch(e){
        expect(e).toBeUndefined()
    }
    expect(saver.pendingQueue.post.size).toEqual(0)
    expect(saver.pendingQueue.put.size).toEqual(0)
    expect(saver.pendingQueue.remove.size).toEqual(0)

    expect(saver.syncQueue.post.size).toEqual(0)
    expect(saver.syncQueue.put.size).toEqual(0)
    expect(saver.syncQueue.remove.size).toEqual(1)
    expect(saver.syncing).toBeFalsy()
})

test('all failed', async () => {
    const saver = createSaver(false, false)
    const syncRequest = saver.sync(createMockComponents())
    try{
        await syncRequest
    }catch(e){
        expect(e).toBeUndefined()
    }
    expect(saver.pendingQueue.post.size).toEqual(0)
    expect(saver.pendingQueue.put.size).toEqual(0)
    expect(saver.pendingQueue.remove.size).toEqual(0)

    expect(saver.syncQueue.post.size).toEqual(1)
    expect(saver.syncQueue.put.size).toEqual(1)
    expect(saver.syncQueue.remove.size).toEqual(1)
    expect(saver.syncing).toBeFalsy()
})

test('new change during processing', async () => {
    const saver = createSaver(false, false)
    const syncRequest = saver.sync(createMockComponents())
    saver.syncQueue.remove.add("10")
    saver.syncQueue.put.add("9")
    saver.syncQueue.post.add("8")
    try{
        await syncRequest
    }catch(e){
        expect(e).toBeUndefined()
    }
    // should merge pending queue with  sync queue
    expect(saver.syncQueue.post.size).toEqual(2)
    expect(saver.syncQueue.put.size).toEqual(2)
    expect(saver.syncQueue.remove.size).toEqual(2)
})