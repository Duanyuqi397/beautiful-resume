import React, { useState } from "react";
import { Component, ConfigProps } from "../types/types";

function useConfig(configs: Record<string, Partial<ConfigProps>>) {
    const [editableProps, setEditableProps] = useState<Omit<ConfigProps, 'name' | 'component'>>();

    function isObjectValueEqual(a: any, b: any) {
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            let propName = aProps[i];
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    }


    function assignProps(target: any, source: any) {
        let obj = target;
        if (typeof target !== 'object' || typeof source !== 'object') {
            return source;
        }
        for (let key in source) {
            if (target.hasOwnProperty(key)) {
                obj[key] = assignProps(target[key], source[key]);
            } else {
                obj[key] = source[key];
            }
        }
        return obj;
    }

    function initConfig(component: Component) {
        //get the current component's editor
        let currentComponentProps = component.props;
        const editorValue = Object.values(configs).filter(item => item.component === component.type);
        if(!editorValue.length) return;
        const editor = editorValue[0];
        console.log('initEditor',editor)

        //save the editable props of currentComponent
        if (editor.drag) {
            currentComponentProps.editor = { ...editor.drag.size, ...editor.style };
        }

        //init the component's props with editor
        currentComponentProps = assignProps(currentComponentProps, editor);
        console.log('init',currentComponentProps)
        setEditableProps(currentComponentProps.editor);
    }

    function getConfig(component: Component) {
        setEditableProps(component.props.editor);
    }

    function setConfig(component: Component, newConfig: Object) {
        let currentComponentProps = component.props;
        //don't change editor if newConfig without change
        if(isObjectValueEqual(currentComponentProps.editor,newConfig)){
           return; 
        }
        currentComponentProps.editor = {...newConfig};
        console.log('editor',currentComponentProps.editor)
        currentComponentProps = assignProps(currentComponentProps, currentComponentProps.editor);
        console.log('set',currentComponentProps)
    }

    return [editableProps, { initConfig, getConfig, setConfig }] as const;
}

export { useConfig };