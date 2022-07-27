import React from "react";
import { Component } from "../types/types";

const renderEngine = (components: Component[]) => {
    const componentsMap = new Map();
    components.map(component => componentsMap.set(component.id, component));
    return renderComponent(components[0], componentsMap);
}

const renderComponent = (component: Component, componentsMap: Map<string, Component>) => {
    if (component.type === "text") {
        return component.props?.valueOf;
    }
    const children: any = component.children.length
        && component.children
            .map(childId => componentsMap.get(childId))
            .map(child => renderComponent(child, componentsMap));
    return React.createElement(component.type, component.props, children);
}

export default renderEngine;