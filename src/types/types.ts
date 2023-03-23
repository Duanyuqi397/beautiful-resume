import { Rule } from "antd/lib/form"
import { merge } from '../scripts/utils'

type BoxProps = {
    width: number,
    height: number,
    x: number,
    y: number
}

type Cprops = BoxProps & Record<string, any>

type Component = {
    id: string;
    props: Cprops;
    type: string;
    children: string[];
}

type Predictor<T> = (item: T) => boolean

type TypeFuncMaping = Record<string, React.FC<Component>>

type EditorType = "Input"|"ColorPicker"|"RichText"|"Select"|"Divider"|"Uploader"|"Position"|"CustomStyle"|"TextArea"

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
    Component,
    TypeFuncMaping,
    EditorType, 
    Editor,
    BaseEditorProps,
    BoxProps
}