import * as React from 'react'
import { CSSProperties } from 'react'
import * as ReactDOM from 'react-dom'


const RESIZE_BALL_SIZE = 9

const RESIZE_BAR_BASE_STYLE: CSSProperties = {
    position: 'fixed',
    borderRadius: '50%',
    backgroundColor: 'rgb(41, 182, 242)'
}

type ResizeBarProps = {
    x: number,
    y: number,
    width: number,
    height: number,
    ballSize?: number,
    onResizeStart?: (e: MouseEvent, direction: Direction) => void,
    onResizeEnd?: (e: MouseEvent, direction: Direction) => void,
    allowDirections?: Direction[]|undefined,
}

type Direction = "up"|"down"|"left"|"right"|"up-left"|"up-right"|"down-left"|"down-right"

type BAR_PROPS = {
    "direction": Direction,
    "style": React.CSSProperties,
    "positionFunction": (props: {size: number, x: number, y: number, width: number, height: number}) => [number, number]
}

const RESIZE_BAR_PROPS: BAR_PROPS[] = [
    {
        "direction": "up",
        "style": {...RESIZE_BAR_BASE_STYLE, 'cursor':'n-resize'},
        'positionFunction': props => [props.x + (props.width - props.size) / 2, props.y - props.size / 2]
    },
    {
        "direction": "down",
        "style": {...RESIZE_BAR_BASE_STYLE, 'cursor':'s-resize'},
        'positionFunction': props => [props.x + (props.width - props.size) / 2, props.y + props.height - props.size / 2 ]
    },
    {
        "direction": "left",
        "style": {...RESIZE_BAR_BASE_STYLE,'cursor':'w-resize'},
        'positionFunction': props => [props.x - props.size / 2, props.y + (props.height - props.size) / 2]
    },
    {
        "direction": "right",
        "style": {...RESIZE_BAR_BASE_STYLE, 'cursor':'e-resize'},
        'positionFunction': props => [props.x + props.width - props.size / 2, props.y + (props.height - props.size) / 2]
    },
    {
        "direction": "up-left",
        "style": {...RESIZE_BAR_BASE_STYLE, 'cursor':'nw-resize'},
        'positionFunction': props => [props.x - props.size / 2, props.y  - props.size / 2]
    },
    {
        "direction": "up-right",
        "style": {...RESIZE_BAR_BASE_STYLE, 'cursor':'ne-resize'},
        'positionFunction': props => [props.x + props.width - props.size / 2, props.y  - props.size / 2]
    },
    {
        "direction": "down-left",
        "style": {...RESIZE_BAR_BASE_STYLE, 'cursor':'sw-resize'},
        'positionFunction': props => [props.x - props.size / 2, props.y + props.height  - props.size / 2]
    },
    {
        "direction": "down-right",
        "style": {...RESIZE_BAR_BASE_STYLE, 'cursor':'se-resize'},
        'positionFunction': props => [props.x + props.width - props.size / 2, props.y + props.height  - props.size / 2] 
    }
]


const ALL_DIRECTIONS = [
    "up",
    "down",
    "left",
    "right",
    "up-left",
    "up-right",
    "down-left",
    "down-right"
] as const

const ResizeBar: React.FC<ResizeBarProps> = (props) => {
    const {
        ballSize=RESIZE_BALL_SIZE,
        onResizeStart=()=>{},
        onResizeEnd=()=>{},
        allowDirections=ALL_DIRECTIONS
    } = props
    const ResizeBar = (
       <div>
            {
                RESIZE_BAR_PROPS.map(prop => {
                    const [left, top] = prop.positionFunction({...props, size: ballSize})
                    return (
                        <div
                            id={prop.direction}
                            draggable="false"
                            onDragStart={e => e.preventDefault()}
                            style={{
                                ...prop.style,
                                left,
                                top,
                                width: ballSize,
                                height: ballSize,
                                zIndex: 100,
                                visibility: allowDirections.includes(prop.direction) ? 'visible': 'hidden'
                            }}
                            onMouseDown={(e) => {
                                onResizeStart(e as any, prop.direction)
                                e.stopPropagation()
                            }}
                            onMouseUp={(e) => {
                                onResizeEnd(e as any, prop.direction)
                                e.stopPropagation()
                            }}
                        />
                    )
                })
            }
            {/* <div
                style={{
                        width,
                        height,
                        position: 'fixed',
                        left: x,
                        top: y,
                        zIndex: 99,
                        border: '1px dashed rgb(41, 182, 242)'
                }}
            /> */}
       </div>
    )
    return ReactDOM.createPortal(ResizeBar, document.getElementById("root") as Element)
}

export default ResizeBar
export type{
    Direction
}