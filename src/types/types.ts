import { CSSProperties, DOMAttributes } from "react";
import { DragDataProps } from "../fragments/Draggable";
import { Rule } from "antd/lib/form"
import { merge } from '../scripts/utils'

export type Component = {
    id: string;
    props: Cprops & Handlers;
    type: string;
    children: string[];
}

type ParitialRequired<T, V extends keyof T> = T & {[P in V]-?: T[P]}

type ComponentStyle = ParitialRequired<CSSProperties, 'width'|'height'>

interface Cprops extends Object {
    id?: string,
    value?: string,
    style: ComponentStyle,
    drag?: DragDataProps,
    imgUrl?: string,
    url?: string,
    editor?: Record<string, any>
}

type ConfigProps = {
    name: string,
    component: string,
    style?:{}
}

interface ComponentProps extends Cprops, Handlers{

}

type FunctionRender = React.FC<ComponentProps>
 

type EventHandlers = Omit<DOMAttributes<Element>, 'children'|'dangerouslySetInnerHTML'>

type Handlers = {
    [key in keyof EventHandlers]: EventHandlers
}

type Predictor<T> = (item: T) => boolean

export type TypeFuncMaping = Record<string, React.FC<ComponentProps>>

type EditorType = "Input"|"ColorPicker"|"RichText"|"Select"|"Divider"|"Uploader"|"Position"

// type EditorProps = {
//     name: string,
//     type: EditorType,
//     group?: string,
//     validateRules?: Rule[]
//     args?: Record<string, any>
// }

type EditorConstructorType = {
    name: string, 
    type: EditorType,
    group?: string, 
    validateRules?: Rule[], 
    otherProps?: Record<string, any>,
    defaultValue?: any
}

class EditorProps{
    constructor(public props: EditorConstructorType){}

    public get name(): string{
        return this.props.name
    }

    public get type(): EditorType{
        return this.props.type
    }

    public get group(): string | undefined{
        return this.props.group
    }

    public get validateRules(): Rule[] | undefined{
        return this.props.validateRules
    }

    public get otherProps(): Record<string, any> | undefined{
        return this.props.otherProps
    }

    public get defaultValue(): any | undefined{
        return this.props.defaultValue
    }

    public mergeProps(particalProps: Partial<EditorConstructorType>){
        return new EditorProps(merge(this.props, particalProps))
    }

    static fromObject(props: EditorConstructorType){
    return new EditorProps(props)
   }

   

   static line(content: string){
    return new EditorProps({
        name: content,
        type: "Divider"
    })
   }
}

type Editor = {
    name: string,
    component: string,
    config: any
}

type BaseEditorProps<T = any> = {
    value: T | undefined,
    onChange: (arg: T) => void,
    [others: string]: any
}

export {
    EditorProps
}

export type {
    Cprops, 
    Predictor, 
    Handlers, 
    FunctionRender,
    ConfigProps, 
    EditorType, 
    Editor,
    BaseEditorProps
}