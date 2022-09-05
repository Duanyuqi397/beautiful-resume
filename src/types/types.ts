import { DraggerProps } from "antd/lib/upload";
import { type } from "os";
import { CSSProperties, DOMAttributes } from "react";
import { DragDataProps } from "../fragments/Draggable";

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
export type {Cprops, Predictor, Handlers, FunctionRender,ConfigProps}