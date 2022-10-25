import {
    setProps,
    mergeProps,
    remove,
    activite,
    add,
    batchMergeProps,
    batchSetProps,
    setState,
    DEFAULT_ROOT,
} from '../context/app'

import { 
    AppContext, 
    Cprops, 
    Component, 
    BatchMergePropsPayload, 
    BatchSetPropsPayload,
    ComponentState,
    OptionalPartial,
    RootComponent
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

type PartialComponent = OptionalPartial<Component, 'parent'|'children'|'id'>

function useApp(){
    const dispatch = useDispatch()
    const components = useAppSelector(state => state.components)
    function addComponet(partialComponent: PartialComponent){
        const defaults = {parent: DEFAULT_ROOT.id, children: []}
        let component = {...defaults, ...partialComponent}
        if(!component.id){
            component = {...component, id: uuidv4()}
        }
        dispatch(add(component as Component))
        console.info(component)
        return component as Component
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

function useRoot(){
    const root = useAppSelector(state => state.components.find(c => c.id === DEFAULT_ROOT.id)) as RootComponent
    if(!root){
        throw Error("can't find root component")
    }
    return {
        root
    }
}

export {
    useActives,
    useApp,
    useRoot,
}

