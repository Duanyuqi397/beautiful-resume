import React, { ReactElement } from "react";
import {
    ComponentRedners,
    Component,
} from '../types'
import { firstLower } from '../utils'
import { useApp, useActives, useRoot } from './appHook'
import BoxComponent from '../box/Box'

function useRender(renderLookup: ComponentRedners){
    const { components, activite } = useApp()
    const { actives } = useActives()
    const { root } = useRoot()
    const componentLookup = new Map(components.map(c => [c.id, c]))
    function render(component: Component): ReactElement{
        const children = component.children
                .map(id => {
                    const component = componentLookup.get(id)
                    if(!component){
                        console.error("can't find component with id", id)
                        return null
                    }
                    return component
                })
                .filter(component => component !== null)
                .map(child => render(child as Component));
        const isDomElement = firstLower(component.type)
        let elementType: React.FC | string = component.type
        if(!isDomElement){
            const componentRender = renderLookup.get(component.type)
            if(!componentRender){
                throw new Error(`render not found for type: ${component.type}`)
            }
            elementType = componentRender
        }
        const eventHandlers = {
            onClick(e: MouseEvent){
                if(component.id === root.id){
                    activite([])
                }else{
                    const activeIds = actives.map(c => c.id)
                    if(component.canActive === false){
                        return
                    }
                    // ctrlKey for windows and metaKey for macos
                    const existedIds = (e.ctrlKey || e.metaKey) ? activeIds: []
                    activite([...existedIds, component.id])
                }
                e.stopPropagation()
            },

            onMouseDown(e: any){
            },

            onMouseUp(e: any){
            },

            onBlur(e: MouseEvent){
            }
        }
        const element = React.createElement(elementType, {key: component.id}, children)
        const props = {id: component.id , ...component.props, ...eventHandlers}
        return (
            <BoxComponent {...component} props={props} inner={element} key={component.id}/>
        )
    }
    return () => render(root)
}

export { useRender }