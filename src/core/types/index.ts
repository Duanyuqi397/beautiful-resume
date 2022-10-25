type Number2 = [number, number]
type Position = Number2
type Size = Number2
type MouseOffset = Number2
type PositionChangeEventHandler = (position: Position[]) => void
type SizeChangeEventHandler = (position: BoxProps) => void
type MouseEventHandler = (offset: MouseOffset, e: MouseEvent) => void

// resize bar
type ResizeDirection = "up"|"down"|"left"|"right"|"up-left"|"up-right"|"down-left"|"down-right"
type ResizeBarProps = {
    target: HTMLElement,
    ballSize?: number,
    onResizeStart?: (e: MouseEvent, direction: ResizeDirection) => void,
    onResizeEnd?: (e: MouseEvent, direction: ResizeDirection) => void,
    allowDirections?: ResizeDirection[] | undefined,
}

type BoxProps = {
    size: Size,
    position: Position
}

type DragAndResizeProps = BoxProps & {
    canDrag?: boolean,
    canResize?: boolean,
    keepRatio?: boolean,
    allowResizeDirection?: ResizeDirection[]
}

type Cprops = BoxProps & Record<string, any>

type ComponentState = "drag" | "resize" | "active" | undefined

type Component = {
    id: string,
    props: Cprops,
    type: string,
    children: string[],
    parent: string,
    canActive?: boolean,
    canDrag?: boolean,
    canResize?: boolean,
    state?: ComponentState
}

type ComponentRedners = Map<string, React.FC<any>>

type AppContext = {
    components: Component[],
    actives: string[]
}

type SetPropsPayload = {
    props: Cprops,
    ids: string[]
}

type MergePropsPayload = {
    props: Partial<Cprops>,
    ids: string[]
}

type SetStatePayload = {
    ids: string[],
    state: ComponentState
}

type BatchSetPropsPayload = {
    [ids: string]: Cprops
}

type BatchMergePropsPayload = {
    [ids: string]: Partial<Cprops>
}

type ActivatePayload = string[]

type DeactivatePayload = string[] | undefined

type DeletePayload = string[]

type AuxiliaryLineProps = {
    axis: "x"|"y",
    offset: number,
    color?: "string"
}


export type {
    Position,
    Size,
    MouseOffset,
    MouseEventHandler,
    ResizeDirection,
    ResizeBarProps,
    BoxProps,
    DragAndResizeProps,
    PositionChangeEventHandler,
    SizeChangeEventHandler,
    Cprops,
    Component,
    AppContext,
    SetPropsPayload,
    MergePropsPayload,
    ActivatePayload,
    DeactivatePayload,
    DeletePayload,
    ComponentRedners,
    BatchMergePropsPayload,
    BatchSetPropsPayload,
    AuxiliaryLineProps,
    SetStatePayload,
    ComponentState,
}