import * as React from 'react'
import { CSSProperties } from 'react'
import * as ReactDOM from 'react-dom'


const RESIZE_BALL_SIZE = 9

const RESIZE_BAR_BASE_STYLE: CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: 'rgb(41, 182, 242)'
}

type ResizeBarProps = {
    target: HTMLElement,
    ballSize?: number,
    onResizeStart?: (e: MouseEvent, direction: Direction) => void,
    onResizeEnd?: (e: MouseEvent, direction: Direction) => void,
    allowDirections?: Direction[]|undefined
}

type Direction = "up"|"down"|"left"|"right"|"up-left"|"up-right"|"down-left"|"down-right"

type BAR_PROPS = {
    direction: Direction,
    callStyle: (props: {size: number, width: number, height: number}) => CSSProperties
}

const RESIZE_BAR_PROPS: BAR_PROPS[] = [
    {
        "direction": "up",
        'callStyle': props => (
            {
                top: -props.size / 2,
                left: (props.width - props.size) / 2,
                'cursor':'n-resize'
            }
        )
    },
    {
        "direction": "down",
        'callStyle': props => (
            {
                bottom: -props.size / 2,
                left: (props.width - props.size) / 2,
                'cursor':'s-resize'
            }
        )
    },
    {
        "direction": "left",
        'callStyle': props => (
            {
                top: (props.height - props.size) / 2,
                left: -props.size / 2,
                'cursor':'w-resize'
            }
        )
    },
    {
        "direction": "right",
        'callStyle': props => (
            {
                bottom: (props.height - props.size) / 2,
                right: -props.size / 2,
                'cursor':'e-resize'
            }
        )
    },
    {
        "direction": "up-left",
        'callStyle': props => (
            {
                left: -props.size / 2,
                top: -props.size / 2,
                'cursor': 'nw-resize'
            }
        )
    },
    {
        "direction": "up-right",
        'callStyle': props => (
            {
                right: -props.size / 2,
                top: -props.size / 2,
                'cursor':'ne-resize'
            }
        )
    },
    {
        "direction": "down-left",
        'callStyle': props => (
            {
                left: -props.size / 2,
                bottom: -props.size / 2,
                'cursor':'sw-resize'
            }
        )
    },
    {
        "direction": "down-right",
        'callStyle': props => (
            {
                right: -props.size / 2,
                bottom: -props.size / 2,
                'cursor':'se-resize'
            }
        )
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
        allowDirections=ALL_DIRECTIONS,
        target
    } = props
    const {width, height} = target.getBoundingClientRect()
    const ResizeBar = (
       <>
            {
                RESIZE_BAR_PROPS.map(prop => {
                    const otherStyle = prop.callStyle({width, height, size: ballSize})
                    return (
                        <div
                            key={prop.direction}
                            id={prop.direction}
                            draggable="false"
                            onDragStart={e => e.preventDefault()}
                            style={{
                                ...RESIZE_BAR_BASE_STYLE,
                                ...otherStyle,
                                width: ballSize,
                                height: ballSize,
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
       </>
    )
    return ReactDOM.createPortal(ResizeBar, props.target)
}

export default ResizeBar
export type{
    Direction
}