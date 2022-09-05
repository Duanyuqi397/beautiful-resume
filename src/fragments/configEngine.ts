import { Component } from "../types/types";

function useConfig(configs: Record<string, any>) {
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

    function getEditor(type: string) {
        const editor = Object.values(configs).find(item => item.component === type);
        return editor
    }

    function initConfig(component: Component) {
        //get the current component's editor
        let currentComponentProps = component.props;
        const editorValue = Object.values(configs).filter(item => item.component === component.type);
        if (!editorValue.length) return component;
        const editor = editorValue[0];

        //init the component's props with editor
        currentComponentProps = assignProps(currentComponentProps, editor);
        return component;
    }

    function setConfig(component: Component, newConfig: Object) {
        let currentComponentProps = component.props;
        //don't change editor if newConfig without change
        if (isObjectValueEqual(currentComponentProps.editor, newConfig)) {
            return;
        }
        currentComponentProps = mergeProps(currentComponentProps, { ...newConfig });
        return currentComponentProps;
    }

    return { getEditor, initConfig, setConfig, getEditableProps, isObjectValueEqual, mergeProps } as const;
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

function getEditableProps(props: any, editor: any) {
    let res: Record<string, any> = {}
    function visit(obj: any) {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                visit(obj[key]);
            } else {
                if (key in editor && key in obj) {
                    res[key] = obj[key];
                }
            }
        }
    }
    visit(props)
    return res
}

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

export { useConfig, getEditableProps, mergeProps };