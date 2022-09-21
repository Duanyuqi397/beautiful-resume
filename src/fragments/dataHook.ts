import Item from 'antd/lib/list/Item'
import * as React from 'react'
import { Component, Cprops, Predictor, Handlers} from '../types/types'
import { v4 as uuidv4 } from 'uuid';
import { type } from '@testing-library/user-event/dist/type';
import { Position } from './Draggable';

function baseMerge<T>(o1: T, o2: Partial<T>): T{
    if(typeof o1 === 'object' && typeof o2 === 'object'){
        return {...o1, ...o2}
    }
    return o2 as T
}

function useArray<T>(array: T[]){
    const [items, setItems] = React.useState(array)
    
    function add(item: T){
        setItems([...items, item])
    }

    function merge(
        filter: Predictor<T>, 
        newItem: Partial<T>, 
        merge: ((old: T, newItem: Partial<T>) => T) = baseMerge){
        setItems(items.map(item => filter(item) ? merge(item, newItem): item))
    }

    function replace( filter: Predictor<T>, newItem: T){
        setItems(items.map(item => filter(item) ? newItem: item))
    }

    function remove(filter: Predictor<T>){
        setItems(items.filter(i => !filter(i)))
    }

    function keep(filter: Predictor<T>){
        setItems(items.filter(filter))
    }

    function find(filter: Predictor<T>){
        return items.filter(filter)
    }

    return [
        items,
        {
            add,
            replace,
            merge,
            remove,
            keep,
            find,
            set: setItems,
        }
    ] as const
}

function useMap<K extends string|number, V>(map: Map<K, V> | null = null){
    const [state, setState] = React.useState(map || new Map())

    function set(key: K, value: V){
        const newMap = new Map(state)
        newMap.set(key, value)
        setState(newMap)
    }

    function get(key: K){
        return state.get(key)
    }

    function remove(key: K){
        const newState = new Map(state)
        newState.delete(key)
        setState(newState)
    }

    return {
        set,
        get,
        remove
    }
}

type ComponentEventHandler = (componentId: string, event: React.SyntheticEvent) => void

type HandlerMapping = {
    'common': {[key: string]: ComponentEventHandler},
    [componentType: string]: {[key: string]: ComponentEventHandler}
} | null


function bindIdtoHandler(id: string){
    return (handlers: {[key: string]: ComponentEventHandler}) => {
        return Object.fromEntries(
            Object.entries(handlers).map(([name, handler]) => [name, handler.bind(null, id)])
        )
    }
}


function useComponents(root: Omit<Component, 'id'|'children'>, handlers: HandlerMapping=null){
    const [components, op] = useArray([{...root, id: "root", children: []} as Component])

    function byId(id: string){
        return (item: Component) => item.id === id
    }

    function add(type: string, props: Cprops): Component{
        const commonHandlers = handlers?.common || {}
        const specifyHandlers = handlers?.type || {}
        const id = uuidv4()
        const binder = bindIdtoHandler(id)
        const wrappedCommonHandlers = binder(commonHandlers)
        const wrappedSpecifyHandlers = binder(specifyHandlers)
        const allProps = {...props, ...wrappedCommonHandlers, ...wrappedSpecifyHandlers}
        const newComponent: Component = {
            type,
            id,
            props: allProps,
            children: []
        }
        const root = find('root')
        root.children.push(newComponent.id)
        op.add(newComponent)
        return newComponent
    }

    function replace(id: string, component: Component){
        op.replace(byId(id), component)
    }

    function merge(id: string, component: Partial<Component>){
        op.merge(byId(id), component)
    }

    function remove(id: string){
        const root = find('root')
        const newChildren = root.children.filter(childId => childId !== id)
        const newRoot = {...root, children: newChildren}
        const newComponents = components.map(component => {
            if(component.id === "root"){
                return newRoot
            }
            return component
        })
        .filter(component => component.id !== id)
        op.set(newComponents)
    }

    function find(id: string){
        return op.find(byId(id))[0]
    }

    function mergeStyle(id: string, style: Object){
        mergePropsTo('style', id, style)
    }

    function mergeProps(id: string, props: Cprops|Handlers){
        const item = find(id)
        const oldProps = item.props
        op.merge(byId(id), {props: {...oldProps, ...props}} as any)
    }

    function mergePropsTo(field: keyof Cprops, id: string, value: Cprops[keyof Cprops]){
        const item = find(id)
        const old = item.props[field] || {}
        if(typeof old !== 'object' || typeof value !== 'object'){
            return
        }
        op.merge(byId(id), {props: {...item.props, [field]: {...old, ...value}}} as any)
    }

    function getMap(){
        const map: Map<string, Component> = new Map();
        components.forEach(item => map.set(item.id, item))
        return map
    }

    return [
        components, 
        {
            merge,
            remove,
            replace,
            mergeStyle,
            getMap,
            add,
            mergeProps,
            mergePropsTo,
            find
        } 
    ] as const
}

export {useComponents, useMap,useArray}
