import React, { ReactElement, ReactNode } from "react";
import { Component, Cprops, FunctionRender, Handlers, TypeFuncMaping as TypeFuncMapping } from "../types/types";
import Draggable, {DRAGABBLE_PROPS} from "./Draggable";

const renderEngine = (components: Component[]) => {
    const componentsMap = new Map();
    components.map(component => componentsMap.set(component.id, component));
    return renderComponent(components[0], componentsMap);
}

const renderComponent = (component: Component, componentsMap: Map<string, Component>) => {
    if (component.type === "text") {
        return component.props?.value;
    }
    const children:any =
            component.children
            .map(childId => componentsMap.get(childId) as Component)
            .map(child => renderComponent(child, componentsMap));
    return React.createElement(component.type, component.props, children);
}

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
        console.info(componentsMap)
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
        if(!componentsMap.has("root")){
            throw new Error('root component not found!')
        }
        return this.renderComponent(componentsMap.get("root") as Component, componentsMap)
    }
}

export default renderEngine;
export {RenderEngine}