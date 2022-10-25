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
                .map(childId => {
                    const child = componentLookup.get(childId)
                    if(!child){
                        throw new Error(`child not found!, parent=${component}`)
                    }
                    return child
                })
                .map(child => render(child));
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
                console.info(e.target, e.currentTarget)
                if(component.id === root.id){
                    activite([])
                }else{
                    const activeIds = actives.map(c => c.id)
                    if(component.canActive === false){
                        return
                    }
                    const existedIds = e.ctrlKey ? activeIds: []
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