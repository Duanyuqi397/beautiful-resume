import * as React from 'react'
import { useState } from 'react'
import ResizeBar, {Direction} from './ResizeBar'

type Position = [number, number]
type DraggableEventHandler = (position: Position) => void
type Size = {
    width: number,
    height: number
}


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
    size?: Size,
    defaultSize?: Size,
    ratio?: number,
    style?: React.CSSProperties,
    minRize?: Size,
}

type DragProps = React.PropsWithChildren<{
    onDrag?: DraggableEventHandler,
    onDragEnd?: DraggableEventHandler,
} & DragDataProps>

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

function removeListenerFromRef(ref: React.MutableRefObject<any>){
    ref.current && document.body.removeEventListener('mousemove', ref.current)
}

const Draggable: React.FC<DragProps> = (props) => {
    const [position, setPosition] = useState<Position>(props.position || props.defaultPosition || [0, 0])
    const startPosition = React.useRef<Position>([0, 0])
    const dragStart = React.useRef(false)
    const mouseStartPosition = React.useRef<Position>([0, 0])
    const targetDomRef = React.useRef<HTMLElement>()
    const movingEventRef = React.useRef(handleMoving)
    const boxRef = React.useRef<DOMRect>()
    const children = props.children as React.ReactElement
    const onMouseDown = children.props.onMouseDown
    const onMouseUp = children.props.onMouseUp
    const onClick = children.props.onClick
    const style = children.props.style || {}
    const [showResizeBar, setShowResizeBar] = React.useState(false)
    const [direction, setDirection] = React.useState<Direction[]>()
    const blurByResizeRef = React.useRef(false)

    const {
        size,
        defaultSize
    } = props

    const initWidth = size?.width || defaultSize?.width 
    const initHeight = size?.height || defaultSize?.height 
    const directionRef = React.useRef<Direction|null>(null)
    const [sizeState, setSizeState] = React.useState({width: initWidth, height: initHeight})
    const startSizeRef = React.useRef<Size>({width: 0, height: 0})
    const resizingEventRef = React.useRef(hadleResizing)

    // sync position status in controlled mode
    React.useLayoutEffect(() => {
        props.position && setPosition(props.position)
    }, [props.position])

    React.useEffect(() => {
        return () => movingEventRef.current && document.body.removeEventListener('mousemove', movingEventRef.current)
    }, [])

    React.useEffect(() => {
        setShowResizeBar(props.showResizeBox || false)
    }, [props.showResizeBox])

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

    function hadleResizing(e: MouseEvent){
        const [mouseStartX, mouseStartY] = mouseStartPosition.current
        let offsetX = e.pageX - mouseStartX
        let offsetY = e.pageY - mouseStartY
        const [x, y] = [offsetX, offsetY]
        const offset = {width: x, height: y}
        let {width, height} = directionRef.current ? calOffsetByDirection(offset, directionRef.current): offset

        const newSize = {
            width: Math.max(startSizeRef.current.width + width, props.minRize?.width || 10) ,
            height: Math.max(startSizeRef.current.height + height, props.minRize?.height || 10)
        }

        const offsetSize = {
            width: newSize.width - startSizeRef.current.width,
            height: newSize.height - startSizeRef.current.height
        }

        const [startX, startY] = startPosition.current
        let [newX, newY] = position
        if(directionRef.current?.includes("left")){    
            newX = startX - offsetSize.width
        }
        if(directionRef.current?.includes("up")){
            newY = startY - offsetSize.height
        }

        if(!props.position){
            setPosition([newX, newY])
        }else{
            props.onDrag && props.onDrag([newX, newY])
        }
        
        setSizeState(newSize)
    }
    
    function handleMoving(e: MouseEvent){
        setShowResizeBar(false)
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
        removeListenerFromRef(movingEventRef)
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
        movingEventRef.current = handleMoving
        startPosition.current = calPosition()
        mouseStartPosition.current = [e.pageX, e.pageY]
        document.body.addEventListener('mousemove', movingEventRef.current)
    }

    function onMouseUpWrapper(e: MouseEvent){
        handleDragEnd()
        onMouseUp && onMouseUp(e)
    }

    function handleShowResizeBar(e: MouseEvent){
        const target = e.currentTarget as HTMLElement
        if(!target){
            throw Error('dom not got mounted when click')            
        }
        setShowResizeBar(true)
        onClick && onClick(e)
        targetDomRef.current = target
    }

    function handleBlur(){
        if(!blurByResizeRef.current){
            setShowResizeBar(false)
        }
    }
    
    function handleResizeStart(e: MouseEvent, direction: Direction){
        if(!targetDomRef.current){
            throw Error('target dom not specify when target resing')
        } 
        const box = (targetDomRef.current as HTMLElement).getBoundingClientRect()
        startSizeRef.current = {
            width: sizeState.width || box.width,
            height: sizeState.height || box.height
        }
        directionRef.current = direction
        startPosition.current = calPosition()
        blurByResizeRef.current = true
        mouseStartPosition.current = [e.pageX, e.pageY]
        setDirection([direction])
        resizingEventRef.current = hadleResizing
        document.body.addEventListener('mousemove', hadleResizing)
        document.body.addEventListener('mouseup', (e) => handleResizeEnd(e, direction))
    }

    function handleResizeEnd(e: MouseEvent, direction: Direction){
        blurByResizeRef.current = false
        setDirection(undefined)
        setShowResizeBar(false)
        removeListenerFromRef(resizingEventRef)
    }

    let resizeBar: React.ReactNode = null
    if(showResizeBar && targetDomRef.current){
        const box = targetDomRef.current.getBoundingClientRect()
        resizeBar = (
            <ResizeBar 
                key={2}
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                allowDirections={direction}
                onResizeStart={handleResizeStart}
                onResizeEnd={handleResizeEnd}
            />
        )
    }

    const wrapperedChildren = React.cloneElement(
        React.Children.only(props.children) as React.ReactElement,
        {
            onMouseDown: onMouseDownWrapper, 
            onMouseUp: onMouseUpWrapper,
            onClick: handleShowResizeBar,
            onBlur: handleBlur,
            style: {
                ...style, 
                ...getStyle(position[0], position[1]),
                cursor: "move",
                width: sizeState.width || 'auto',
                height: sizeState.height || 'auto'
            }
        },
    )
    
    return (
        <>
            {wrapperedChildren}
            {resizeBar}
        </>
    )
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