import * as React from "react"
import { useArray } from "./dataHook"
import useMouseOffset from './mouseHook'

type Size = {
    width: number,
    height: number
}

type ResizeableProps = {
    size?: Size,
    defaultSize?: Size,
    ratio?: number,
    style?: React.CSSProperties,
    minRize?: Size,
    bound?: 'parent',
    [otherArgs: string]: any,
    translate?: [number, number]
}

type Direction = "up"|"down"|"left"|"right"|"up-left"|"up-right"|"down-left"|"down-right"

type BAR_PROPS = {
    "direction": Direction,
    "style": React.CSSProperties,
}

const RESIZE_BAR_PROPS: BAR_PROPS[] = [
    {
        "direction": "up",
        "style": {'cursor':'n-resize', position: 'absolute', height: 5, left: 0, top: 0, width: '100%', backgroundColor: 'gray'}
    },
    {
        "direction": "down",
        "style": {'cursor':'s-resize', position: 'absolute', height: 5, left: 0, bottom: 0, width: '100%', backgroundColor: 'gray'}
    },
    {
        "direction": "left",
        "style": {'cursor':'w-resize', position: 'absolute', height: '100%', left: 0, top: 0, width: 5, backgroundColor: 'gray'}
    },
    {
        "direction": "right",
        "style": {'cursor':'e-resize', position: 'absolute', height: '100%', right: 0, bottom: 0, width: 5, backgroundColor: 'gray'}
    },
    {
        "direction": "up-left",
        "style": {'cursor':'nw-resize', position: 'absolute', height: 5, left: 0, top: 0, width: 5, backgroundColor: 'black'}
    },
    {
        "direction": "up-right",
        "style": {'cursor':'ne-resize', position: 'absolute', height: 5, right: 0, top: 0, width: 5, backgroundColor: 'black'}
    },
    {
        "direction": "down-left",
        "style": {'cursor':'sw-resize', position: 'absolute', height: 5, left: 0, bottom: 0, width: 5, backgroundColor: 'black'}
    },
    {
        "direction": "down-right",
        "style": {'cursor':'se-resize', position: 'absolute', height: 5, right: 0, bottom: 0, width: 5, backgroundColor: 'black'}
    }
]


function calOffsetByDirection(offset: Size, direction: Direction): Size{
    let offsetWidth = 0
    let offsetHeight = 0
    if(direction.includes("left") || direction.includes("right")){
        offsetWidth = direction.includes("left") ? -offset.width : offset.width
    }
    if(direction.includes("up") || direction.includes("down")){
        offsetHeight = direction.includes("up") ? -offset.height: offset.height
    }
    return {
        width: offsetWidth,
        height: offsetHeight
    }
}


const Resizeable: React.FC<React.PropsWithChildren<ResizeableProps >> = (props) => {
    const {
        size,
        defaultSize,
        ratio,
        minRize
    } = props
 
    const wrapperRef = React.useRef<HTMLDivElement|null>(null)
    const initWidth = size?.width || defaultSize?.width || 50
    const initHeight = size?.height || defaultSize?.height || 50
    const directionRef = React.useRef<Direction|null>(null)
    const [sizeState, setSizeState] = React.useState({width: initWidth, height: initHeight})
    const startSizeRef = React.useRef<Size>({width: 0, height: 0})
    const [offset, setOffset] = React.useState<[number, number]>([0, 0])
    const offsetRef = React.useRef<typeof offset>([0, 0])
    
    const [moving, start, stop] = useMouseOffset((mouseOffset, e) => {
        const [x, y] = mouseOffset
        const offset = {width: x, height: y}
        let {width, height} = directionRef.current ? calOffsetByDirection(offset, directionRef.current): offset

        const newSize = {
            width: Math.max(startSizeRef.current.width + width, minRize?.width || 10) ,
            height: Math.max(startSizeRef.current.height + height, minRize?.height || 10)
        }

        const offsetSize = {
            width: newSize.width - startSizeRef.current.width,
            height: newSize.height - startSizeRef.current.height
        }

        if(directionRef.current?.includes("left")){
            const [startX, startY] = offsetRef.current
            setOffset([startX - offsetSize.width, startY])
        }
        if(directionRef.current?.includes("top")){
            const [startX, startY] = offsetRef.current
            setOffset([startX, startY - offsetSize.width])
        }
        setSizeState(newSize)
    })
    
    function handleResizeBarDown(direction: Direction, e: MouseEvent){
        if(!moving()){
            startSizeRef.current = sizeState
            directionRef.current = direction
            offsetRef.current = offset
            start(e)
        }
    }

    function handleResizeBarUp(){
        stop()
    }

    function renderResizeBar(){
        return RESIZE_BAR_PROPS.map(props => {
            return (
                <div 
                    key={props.direction} 
                    draggable="false"
                    style={{...props.style}} 
                    onMouseDown={e => handleResizeBarDown(props.direction, e as any)}
                    onMouseUp={handleResizeBarUp}
                    onDragStart={e => e.preventDefault()}
                />
            )
        })
    }

    return (
        <div
            draggable="false"
            ref={wrapperRef} 
            style={{
                    ...props.style, 
                    position: 'relative', 
                    width: sizeState.width, 
                    height: sizeState.height, 
                    transform: `translate(${offset[0]}px, ${offset[1]}px)`
                }}
            onDragStart={e => e.preventDefault()}
        >
            <>
                {props.children}
                {
                    renderResizeBar()
                }
            </>
        </div>
    )
}
export default Resizeable;

export type {
    ResizeableProps
}