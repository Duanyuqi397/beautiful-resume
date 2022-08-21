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
 
interface Cprops extends Object {
    id?: string,
    value?: string,
    style?: CSSProperties,
    drag?: DragDataProps,
    imgUrl?: string,
    editor?: ConfigProps
}

type ConfigProps = {
    name: string,
    component: string,
    position?:{},
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