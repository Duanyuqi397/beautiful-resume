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

    //for initConfig
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

    function loop(target: any, source: any) {
        for (const key in source) {
            if (typeof source[key] === 'object') {
                loop(target, source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }
    
    //for setConfig
    function mergeProps(a: any, b: any) {
        const nb = loop({}, b);
        function visit(obj: any) {
            for (const key in obj) {
                if (typeof obj[key] === 'object') {
                    visit(obj[key]);
                } else {
                    if (key in nb) {
                        obj[key] = nb[key];
                    }
                }
            }
        }
        visit(a);
        return a;
    }

    function initConfig(component: Component) {
        //get the current component's editor
        let currentComponentProps = component.props;
        const editorValue = Object.values(configs).filter(item => item.component === component.type);
        if(!editorValue.length) return;
        const editor = editorValue[0];

        //save the editable props of currentComponent
        if (editor.drag) {
            currentComponentProps.editor = { ...editor.drag.size, ...editor.style };
        }

        //init the component's props with editor
        currentComponentProps = assignProps(currentComponentProps, editor);
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
        //save current change in editor,
        //to ensure anytime the getConfig function can get the latest change
        currentComponentProps.editor = {...newConfig};
        currentComponentProps = mergeProps(currentComponentProps, currentComponentProps.editor);
        getConfig(component);
    }

    return [editableProps, { initConfig, getConfig, setConfig }] as const;
}

export { useConfig };