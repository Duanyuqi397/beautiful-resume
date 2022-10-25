import {
    setProps,
    mergeProps,
    remove,
    activite,
    add,
    batchMergeProps,
    batchSetProps,
    setState,
} from '../context/app'

import { 
    AppContext, 
    Cprops, 
    Component, 
    BatchMergePropsPayload, 
    BatchSetPropsPayload,
    ComponentState,
} from '../types'

import { useSelector, useDispatch } from 'react-redux'

import {v4 as uuidv4} from 'uuid'

function useAppSelector<T>(selector: (state: AppContext) => T): T {
    return useSelector((s: any) => selector(s.app)) as T
}

function useActives(){
    const ids = useAppSelector(state => state.actives)
    const activieComponents = useAppSelector(state => state.components.filter(c => ids.includes(c.id)))
    const dispatch = useDispatch()
    return {
        actives: activieComponents,
        merge: (props: Partial<Cprops>) => dispatch(mergeProps({props, ids})),
        set: (props: Cprops) => dispatch(setProps({props, ids})),
     }
}

function useApp(){
    const dispatch = useDispatch()
    const components = useAppSelector(state => state.components)
    function addComponet(component: Omit<Component, 'id'> & {id?: string}){
        if(!component.id){
            const c = {...component, id: uuidv4()} as Component
            dispatch(add(c))
            return c as Component
        }else {
            dispatch(add(component as Component))
            return component as Component
        }
    }
    return {
        components,
        add: addComponet,
        activite: (ids: string[]) => dispatch(activite(ids)),
        remove: (ids: string[]) => dispatch(remove(ids)),
        merge: (id: string, props: Partial<Cprops>) => dispatch(mergeProps({props, ids: [id]})),
        set: (id: string, props: Cprops) => dispatch(setProps({props, ids: [id]})),
        batchSet: (batch: BatchSetPropsPayload) => dispatch(batchSetProps(batch)),
        batchMerge: (batch: BatchMergePropsPayload) => dispatch(batchMergeProps(batch)),
        setState: (ids: string[], state: ComponentState) => dispatch(setState({ids: ids, state}))
    }
}

export {
    useActives,
    useApp,
}

