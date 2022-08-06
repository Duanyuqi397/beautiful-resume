import * as React from 'react'
import { useState } from 'react'

type Position = [number, number]
type DraggableEventHandler = (position: Position) => void

type DragDataProps = {
    position?: [number, number],
    defaultPosition?: [number, number],
    allowButtons?: ('left'|'middle'|'right')[],
    disableArea?: number | {
        left?: number,
        right?: number,
        top?: number,
        buttom?: number
    },
    bound?: 'parent',
    allowCtrl?: boolean,
    canDrag?:boolean,
    showResizeBox?: boolean,
}

type DragProps = React.PropsWithChildren<{
    onDrag?: DraggableEventHandler,
    onDragEnd?: DraggableEventHandler,
} & DragDataProps>

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

const DRAGABBLE_PROPS = new Set([
    "onDrag",
    "onDragEnd",
    "drag",
])


function getStyle(x: number, y: number){
    return {
        transform: `translate(${x}px, ${y}px)`,
        transition: "null",
    }
}

function getMouseButton(e: MouseEvent){
    switch(e.button){
        case 0: return 'left';
        case 1: return 'middle';
        case 2: return 'right';
        default: return 'left';
    }
}

function getParentBoundOffset(offsetPosition: Position, element: HTMLElement | undefined, box: DOMRect|undefined){
    if(!element || !box){
        return offsetPosition
    }
    const parentBox = element.parentElement?.getBoundingClientRect()
    if(!parentBox){
        return offsetPosition
    }
    
    const [offsetX, offsetY] = offsetPosition
    let {left, right, top, bottom} = box
    let boundX = offsetX
    let boundY = offsetY

    if(offsetX < 0){
        boundX = Math.max(parentBox.left - left, offsetX)
    }else{
        boundX = Math.min(parentBox.right - right, offsetX)
    }

    if(offsetY < 0){
        boundY = Math.max(parentBox.top - top, offsetY)
    }else{
        boundY = Math.min(parentBox.bottom - bottom, offsetY)
    }

    return [boundX, boundY]

}

const Draggable: React.FC<DragProps> = (props) => {
    const [position, setPosition] = useState<Position>(props.position || props.defaultPosition || [0, 0])
    const startPosition = React.useRef<Position>([0, 0])
    const dragStart = React.useRef(false)
    const mouseStartPosition = React.useRef<Position>([0, 0])
    const targetDomRef = React.useRef<HTMLElement>()
    const eventRef = React.useRef(handleMouseMove)
    const boxRef = React.useRef<DOMRect>()
    const children = props.children as React.ReactElement
    const onMouseDown = children.props.onMouseDown
    const onMouseUp = children.props.onMouseUp
    const style = children.props.style || {}

    // sync position status in controlled mode
    React.useLayoutEffect(() => {
        props.position && setPosition(props.position)
    }, [props.position])

    React.useEffect(() => {
        return () => eventRef.current && document.body.removeEventListener('mousemove', eventRef.current)
    }, [])

    function calPosition(){
        return props.position || position
    }

    function shouldCancle(e: MouseEvent){
        if(!props.allowCtrl && e.ctrlKey){
            return true
        }
        const mouseButton = getMouseButton(e)
        if(props.allowButtons && !props.allowButtons.includes(mouseButton)){
            return true
        }
        let [left, right, top, bottom] = [0, 0, 0, 0]
        if(typeof props.disableArea === 'number'){
            [left, right, top, bottom] = Array(4).fill(props.disableArea)
        }else if(typeof props.disableArea === 'object'){
           left = props.disableArea.left || 0
           right = props.disableArea.right || 0
           top = props.disableArea.top || 0
           bottom = props.disableArea.buttom || 0
        }
        const [x, y] = [e.clientX, e.clientY]
        const targetDom = e.currentTarget as any
        if(targetDom === null){
            return true
        }
        const box = targetDom.getBoundingClientRect()
        if(x < box.left + left || y < box.top + top){
            return true
        }
        if(x > box.right - right || y > box.bottom - bottom){
            return true
        }
        return false
    }
    
    function handleMouseMove(e: MouseEvent){
        const [startX, startY] = calPosition()
        const [mouseStartX, mouseStartY] = mouseStartPosition.current
        let offsetX = e.pageX - mouseStartX
        let offsetY = e.pageY - mouseStartY
        if(props.bound === 'parent'){
            [offsetX, offsetY] = getParentBoundOffset([offsetX, offsetY], targetDomRef.current, boxRef.current)
        }
        const nextPosition: Position = [startX + offsetX, startY + offsetY]
        if(!dragStart.current){
            dragStart.current = true
            // disable userSelect to avoid content being selected during drag
            document.body.style.userSelect = 'none'
        }
        // ignore state update if this is a controlled component
        if(!props.position){
            setPosition(nextPosition)
        }
        props.onDrag && props.onDrag(nextPosition)
    }

    function handleDragEnd(){
        if(eventRef.current !== null){
            document.body.removeEventListener('mousemove', eventRef.current)
        }
        document.body.style.userSelect = 'initial'
        dragStart.current = false
        targetDomRef.current = undefined
        const position = calPosition()
        props.onDragEnd && props.onDragEnd(position)
    }

    function onMouseDownWrapper(e: MouseEvent){
        onMouseDown && onMouseDown(e)
        if(shouldCancle(e)){
            return
        }
        /**
         * don't record start position if aleardy in a drag process
         * for example, release mouse button when element shaded by another element
         * the mouseUp event will not trigger
         * we should not record the start position when the mouseDown event trigger again
         * mouseDown -> mouseUp(not trigger event) -> mouseDown(aleardy in a drag process, should not record start position)
         */
        if(dragStart.current){
            return
        }
        targetDomRef.current = e.currentTarget as HTMLElement
        boxRef.current = (e.currentTarget as HTMLElement).getBoundingClientRect()
        eventRef.current = handleMouseMove
        startPosition.current = calPosition()
        mouseStartPosition.current = [e.pageX, e.pageY]
        document.body.addEventListener('mousemove', eventRef.current)
    }

    function onMouseUpWrapper(e: MouseEvent){
        handleDragEnd()
        onMouseUp && onMouseUp(e)
    }
    
    const wrapperedChildren = React.cloneElement(
        React.Children.only(props.children) as React.ReactElement,
        {
            onMouseDown: onMouseDownWrapper, 
            onMouseUp: onMouseUpWrapper,
            style: {
                ...style, 
                ...getStyle(position[0], position[1]),
                cursor: "move"
            }
        }
    )
    
    return wrapperedChildren
}

export default Draggable;

Draggable.defaultProps = {
    allowButtons: ['left'],
    allowCtrl: false,
    disableArea: 0
}

export {
    DRAGABBLE_PROPS
}

export type {
    Position,
    DragDataProps
}