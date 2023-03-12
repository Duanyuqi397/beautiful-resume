import { Reducer, AnyAction } from '@reduxjs/toolkit' 

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
    position: Position,
    layer: number,
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

type ComponentWithSyncTime = Component & {
    syncTime: number
}

type RootComponent = {
    id: string,
    props: Cprops & {id: string},
    type: string,
    children: string[],
    parent: string,
    canActive?: boolean,
    canDrag?: boolean,
    canResize?: boolean,
    state?: ComponentState
}

type ComponentRedners = Map<string, React.FC<any>>

type RequestStatus='processing'|'success'|'failed'|'idle'
type AppContext = {
    components: Component[],
    actives: string[],
    syncStatus: RequestStatus,
    resumeId: string|null
}

type SetPropsPayload = readonly [Component['id'], Cprops]

type MergePropsPayload = readonly [Component['id'], Partial<Component['props']>]

type SetStatePayload = {
    ids: string[],
    state: ComponentState
}
type InitPayload = {
    components: Component[],
    resumeId: string
}


type ActivatePayload = string[]

type DeactivatePayload = string[] | undefined

type DeletePayload = string[]

type AuxiliaryLineProps = {
    axis: "x"|"y",
    offset: number,
    color?: "string"
}

type OptionalPartial<T, K extends keyof T> = Omit<T, K> & {
    [P in K]?: T[P]
}

type GeneralReducer = Reducer<AppContext, AnyAction>


type DiffType = 'PUT'|'REMOVE'

type Diff = {
    id: string,
    type: DiffType
}

type SyncQueue = {
    post: Set<string>,
    put: Set<string>,
    remove: Set<string>
}

interface SyncClient{
    put(resumeId: string, components: ComponentWithSyncTime[]): Promise<any>,
    remove(resumeId: string, ids: string[]): Promise<any>
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
    AuxiliaryLineProps,
    SetStatePayload,
    ComponentState,
    OptionalPartial,
    RootComponent,
    GeneralReducer,
    Diff,
    RequestStatus,
    SyncQueue,
    SyncClient,
    ComponentWithSyncTime,
    InitPayload
}