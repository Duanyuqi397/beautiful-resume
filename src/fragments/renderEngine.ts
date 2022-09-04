import React, { ReactElement, ReactNode } from "react";
import { Component, Cprops, FunctionRender, Handlers, TypeFuncMaping as TypeFuncMapping } from "../types/types";
import Draggable, {DRAGABBLE_PROPS} from "./Draggable";

function firstLower(str: string): boolean{
    return str.length === 0 ? false: str.charCodeAt(0) > 96
}

class RenderEngine{
    private typeFuncMapping: TypeFuncMapping
    
    constructor(typeFuncMaping: TypeFuncMapping){
        this.typeFuncMapping = typeFuncMaping
    }
    
    private wrapWithDrag(component: ReactElement, dragProps: any){
        if(dragProps.canDrag){
            return React.createElement(Draggable, {...dragProps, key: component.key}, component)
        }
        return component
    }

    private splitDragProps(props: Cprops|Handlers){
        const whetherDragProps = (whether: boolean) => 
                                        ([k]: string[]) => DRAGABBLE_PROPS.has(k) === whether
        const propsEntries = Object.entries(props)
        const dragProps = Object.fromEntries(propsEntries.filter(whetherDragProps(true)))
        const otherProps = Object.fromEntries(propsEntries.filter(whetherDragProps(false)))
        const dragDataProps = dragProps.drag || {}
        dragDataProps && delete dragProps.drag
        return [{...dragDataProps, ...dragProps}, otherProps]
    }

    private renderComponent(component: Component, componentsMap: Map<string, Component>): ReactNode{
        if (component.type === "text") {
            return component.props?.value;
        }
        const children = component.children
                .map(childId => componentsMap.get(childId) as Component)
                .map(child => this.renderComponent(child, componentsMap));
        const componentFunction = firstLower(component.type) ? component.type: 
                                                            this.typeFuncMapping[component.type]
        const [dragProps, otherProps] = this.splitDragProps(component.props)
        const element = React.createElement(componentFunction, {...otherProps, key: component.id} as any, children);
        return this.wrapWithDrag(element, dragProps)
    }

    render(componentsMap: Map<string, Component>): ReactNode{
        return this.renderComponent(componentsMap.get("root") as Component, componentsMap)
    }
}

// export default renderEngine;
export {RenderEngine}