import {
    setProps,
    remove,
    activite,
    add,
    setState,
    DEFAULT_ROOT,
    init
} from '../context/app'

import { 
    AppContext, 
    Cprops, 
    Component, 
    ComponentState,
    OptionalPartial,
    RootComponent,
    SetPropsPayload,
    MergePropsPayload,
} from '../types'

import { useSelector, useDispatch } from 'react-redux'

import {v4 as uuidv4} from 'uuid'

import { merge as mergeObject, toLookup, applyRomoteURL } from '../utils'

import { ActionCreators } from "redux-undo";

import { useEvent } from './eventHook'

function useAppSelector<T>(selector: (state: AppContext) => T): T {
    return useSelector((s: any) => selector(s.app.present)) as T
}

function useActives(){
    const ids = useAppSelector(state => state.actives)
    const activieComponents = useAppSelector(state => state.components.filter(c => ids.includes(c.id)))

    return {
        actives: activieComponents,
        activeIds: activieComponents.map(c => c.id)
     }
}

type PartialComponent = OptionalPartial<Component, 'parent'|'children'|'id'> & {
    props: OptionalPartial<Component['props'], 'layer'>
}

function useApp(){
    const dispatch = useDispatch()
    const {components, syncStatus} = useAppSelector(state => ({components: state.components, syncStatus: state.syncStatus}))
    function addComponet(partialComponent: PartialComponent){
        const defaults = {parent: DEFAULT_ROOT.id, children: []}
        let component = {...defaults, ...partialComponent}
        if(!component.id){
            component = {...component, id: uuidv4()}
        }
        if(!component.props.layer){
            const maxLayer = Math.max(...components.map(c => c.props.layer))
            const props: Cprops = {...component.props, layer: maxLayer + 1}
            component = {...component, props}
        }
        dispatch(add(component as Component))
        return component as Component
    }

    function merge(partialPropsWithId: MergePropsPayload[]){
        const componentLookup = toLookup(components, c => c.id)
        const propsWithId = partialPropsWithId.map(([id, props]) => {
            const component = componentLookup.get(id)
            if(component){
                return [id, mergeObject(component.props, props)]
            }
            return null
        })
        .filter(x => x !== null)
        dispatch(setProps(propsWithId as unknown as SetPropsPayload[]))
    }


    return {
        components,
        add: addComponet,
        activite: (ids: string[]) => dispatch(activite(ids)),
        deActivite: () => dispatch(activite([])),
        remove: (ids: string[]) => dispatch(remove(ids)),
        merge: useEvent((id: string, props: Partial<Cprops>) => merge([[id, props]])),
        set: (id: string, props: Cprops) => dispatch(setProps([[id, props]])),
        batchSet: (batch: SetPropsPayload[]) => dispatch(setProps(batch)),
        batchMerge: (batch: MergePropsPayload[]) => merge(batch),
        setState: (ids: string[], state: ComponentState) => dispatch(setState({ids: ids, state})),
        syncStatus,
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

function useHistory(){
    const dispatch = useDispatch()
    return {
        redo: () => dispatch(ActionCreators.redo()),
        undo: () => dispatch(ActionCreators.undo())
    }
}

function useSerialize(){
    const { components } = useApp()
    const dispatch = useDispatch()
    return {
        serialize(){
            return JSON.stringify(components)
        },
        deserialize(json: string){
            const components = JSON.parse(json) as Component[]
            return dispatch(init({
                components: components.map(applyRomoteURL),
                resumeId: "$local"
            }))
        },
        init(components: Component[], resumeId: string){
            return dispatch(init({
                components: components.map(applyRomoteURL),
                resumeId
            }))
        }
    }
}

export {
    useActives,
    useApp,
    useRoot,
    useHistory,
    useSerialize,
}

