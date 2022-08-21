import React, { CSSProperties, useState } from "react";
import { Component, ConfigProps } from "../types/types";
import { useComponents } from "./dataHook";

const defaultRoot: Omit<Component, "id" | "children"> = {
    type: "div",
    props: {
        id: "root-container",
        style: { backgroundColor: "pink", position: "relative", height: "842px", width: "595px", margin: 'auto' },
    },
};

function useConfig(configs: Record<string, ConfigProps>) {
    const mapIdToConfig = new Map<string, Object>();
    const [elements, op] = useComponents(defaultRoot);
    const [editableProps, setEditableProps] = useState<CSSProperties>();

    function addConfig(component: Component) {
        const currentComponent = component;
        //get the current component's editor
        const editorValue = Object.values(configs).filter(item => item.component === component.type);
        const editor = editorValue[0];
        //init the component's props with editor
        currentComponent.props.editor = editor;
        currentComponent.props.style = { ...currentComponent.props.style, ...editor.style };
        setEditableProps(editor.style);
        return currentComponent;
    }

    function updateConfig(component: Component, newConfig: CSSProperties) {
        const currentComponentStyle = {...component.props.style,...newConfig};
        setEditableProps(currentComponentStyle);
        return currentComponentStyle;
    }

    return [editableProps, { addConfig, updateConfig }] as const;
}

export { useConfig };