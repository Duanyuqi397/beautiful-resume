import * as React from 'react'
import { useState } from 'react'
import useEvent from './eventHook'
import useMouseOffset from './mouseHook'
import ResizeBar, {Direction} from './ResizeBar'
import * as utils from '../scripts/utils'

type Position = [number, number]
type DraggableEventHandler = (position: Position) => void
type SizeChangeEventHandler = (size: Size) => void

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
    defaultSize?: Size,
    ratio?: number,
    style?: React.CSSProperties,
    minRize?: Size,
    canResize?: boolean
}
type Limit = [number, number, number, number]

type DragProps = React.PropsWithChildren<{
    onSizeChange?: SizeChangeEventHandler,
    onPositionChange?: DraggableEventHandler,
    onDragEnd?: DraggableEventHandler,
    onResizeEnd?: SizeChangeEventHandler
} & DragDataProps>

const DRAGABBLE_PROPS = new Set([
    "onPositionChange",
    "onDragEnd",
    "onSizeChange",
    "onResizeEnd",
    "drag",
])

const NO_LIMIT = Array(4).fill(Infinity) as Limit

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

function calOffsetByDirection(offset: Position, direction: Direction): [number, number]{
    let offsetWidth = 0
    let offsetHeight = 0
    const [width, height] = offset
    if(direction.includes("left") || direction.includes("right")){
        offsetWidth = direction.includes("left") ? -width : width
    }
    if(direction.includes("up") || direction.includes("down")){
        offsetHeight = direction.includes("up") ? -height : height
    }
    return [
        offsetWidth,
        offsetHeight,
    ]
}

function getParentBoundLimit(element: HTMLElement): Limit{
    if(!element){
        throw Error('element is not got mounted')
    }
    const parentBox = element.parentElement?.getBoundingClientRect()
    if(!parentBox){
        return NO_LIMIT
    }
    let {left, right, top, bottom} = element.getBoundingClientRect()
    return [
        parentBox.top - top,
        parentBox.bottom - bottom,
        parentBox.left - left,
        parentBox.right - right,
    ]
}

function getBoundOffset(offsetPosition: Position, offsetLimit: Limit){
    const [offsetX, offsetY] = offsetPosition
    const [limitTop, limitBottom, limitLeft, limitRight] = offsetLimit
    const boundX = offsetX < 0 ? -Math.min(Math.abs(limitLeft), -offsetX): Math.min(limitRight, offsetX)
    const boundY = offsetY < 0 ? -Math.min(Math.abs(limitTop), -offsetY): Math.min(limitBottom, offsetY)
    return [boundX, boundY]

}

const Draggable: React.FC<DragProps> = (props) => {
    
    const [position, setPosition] = useState<Position>(props.position || props.defaultPosition || [0, 0])
    const startPosition = React.useRef<Position>([0, 0])
    const targetDomRef = React.useRef<HTMLElement>()
    const children = props.children as React.ReactElement
    
    const onMouseDown = children.props.onMouseDown
    const onMouseUp = children.props.onMouseUp
    const onClick = children.props.onClick

    const style = children.props.style || {}
    const [showResizeBar, setShowResizeBar] = React.useState(false)
    const [direction, setDirection] = React.useState<Direction[]>()
    const blurByResizeRef = React.useRef(false)
    const positionBoundLimitRef = React.useRef<Limit>(NO_LIMIT)
    const sizeLimitRef = React.useRef<Limit>()

    const {
        defaultSize
    } = props
    
    const initWidth = utils.parseNumberFromStyle(style.width) || defaultSize?.width 
    const initHeight = utils.parseNumberFromStyle(style.height) || defaultSize?.height 
    
    const directionRef = React.useRef<Direction|null>(null)
    const [sizeState, setSize] = React.useState({width: initWidth, height: initHeight})
    const startSizeRef = React.useRef<Size>({width: 0, height: 0})

    const [moving, startMove, stopMoving] = useMouseOffset(
        handleMoving,
        handleDragEnd
    )

    const [resizing, startResize, stopResizing] = useMouseOffset(
        hadleResize,
        handleResizeEnd
    )

    React.useEffect(() => {
        setShowResizeBar(props.showResizeBox || false)
    }, [props.showResizeBox])

    function calPosition(){
        return props.position || position
    }

    function calSize(){
        return {width: utils.parseNumberFromStyle(style.width), height: utils.parseNumberFromStyle(style.height)}
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

    function handleMoving(offset: [number, number], e: MouseEvent){
        setShowResizeBar(false)
        const [startX, startY] = startPosition.current
        let [offsetX, offsetY] = getBoundOffset(offset, positionBoundLimitRef.current)
        const nextPosition: Position = [startX + offsetX, startY + offsetY]
        // ignore state update if this is a controlled component
        props.position || setPosition(nextPosition)
        props.onPositionChange && props.onPositionChange(nextPosition)
    }

    function handleDragEnd(){
        targetDomRef.current = undefined
        const position = calPosition()
        props.onDragEnd && props.onDragEnd(position)
    }

    function calParentBoundLimit(e: HTMLElement){
        return props.bound ? getParentBoundLimit(e) : NO_LIMIT
    }

    function onMouseDownWrapper(e: MouseEvent){
        onMouseDown && onMouseDown(e)
        if(shouldCancle(e) || moving()){
            return
        }
        /**
         * don't record start position if aleardy in a drag process
         * for example, release mouse button when element shaded by another element
         * the mouseUp event will not trigger
         * we should not record the start position when the mouseDown event trigger again
         * mouseDown -> mouseUp(not trigger event) -> mouseDown(aleardy in a drag process, should not record start position)
         */
        targetDomRef.current = e.currentTarget as HTMLElement
        positionBoundLimitRef.current = calParentBoundLimit(e.currentTarget as HTMLElement)
        startPosition.current = calPosition()
        startMove(e)
    }

    function onMouseUpWrapper(e: MouseEvent){
        handleDragEnd()
        stopMoving()
        onMouseUp && onMouseUp(e)
    }

    function handleShowResizeBar(e: MouseEvent){
        if(showResizeBar){
            onClick && onClick(e)
            setShowResizeBar(false)
            return
        }
        const target = e.currentTarget as HTMLElement
        if(!target){
            throw Error('dom not got mounted when click')            
        }
        targetDomRef.current = target
        setShowResizeBar(true)
        onClick && onClick(e)
    }

    function handleBlur(){
        if(!blurByResizeRef.current){
            setShowResizeBar(false)
        }
    }

    function hadleResize(offset: Position, e: MouseEvent){
        let [mouseOffsetX, mouseOffsetY] = getBoundOffset(offset, positionBoundLimitRef.current)
        let [width, height] = directionRef.current
                                        ? calOffsetByDirection([mouseOffsetX, mouseOffsetY], directionRef.current)
                                        : offset
        const newSize = {
            width: Math.max(startSizeRef.current.width + width, props.minRize?.width || 10) ,
            height: Math.max(startSizeRef.current.height + height, props.minRize?.height || 10)
        }

        const posOffset = [
            startSizeRef.current.width - newSize.width,
            startSizeRef.current.height - newSize.height,
        ] as Position

        let [nextX, nextY] = startPosition.current
      
        if(directionRef.current?.includes("left")){    
            nextX = nextX + posOffset[0]
        }
        if(directionRef.current?.includes("up")){
            nextY = nextY + posOffset[1]
        }
        props.position || setPosition(nextPosition)
        setSize(newSize)
        props.onPositionChange && props.onPositionChange([nextX, nextY])
        props.onSizeChange && props.onSizeChange(newSize)
    }

    const handleResizeStart = useEvent((e: MouseEvent, direction: Direction) => {
        if(resizing()){
            return
        }
        if(!targetDomRef.current){
            throw Error('target dom not specify when target resing')
        } 
        const box = (targetDomRef.current as HTMLElement).getBoundingClientRect()
        const size = calSize()
        startSizeRef.current = {
            width: size.width || box.width,
            height: size.height || box.height
        }
        setDirection([direction])
        directionRef.current = direction
        startPosition.current = calPosition()
        blurByResizeRef.current = true
        positionBoundLimitRef.current = calParentBoundLimit(targetDomRef.current)
        sizeLimitRef.current = getParentBoundLimit(targetDomRef.current)
        startResize(e)
    })

    function handleResizeEnd(e: MouseEvent){
        blurByResizeRef.current = false
        setDirection(undefined)
        setShowResizeBar(false)
        stopResizing()
        props.onResizeEnd && props.onResizeEnd(calSize() as any)
    }

    let resizeBar: React.ReactNode = null
    if(showResizeBar && targetDomRef.current && props.canResize){
        const box = targetDomRef.current.getBoundingClientRect()
        resizeBar = (
            <ResizeBar 
                target={targetDomRef.current as HTMLElement}
                key={2}
                allowDirections={direction}
                onResizeStart={handleResizeStart}
                onResizeEnd={handleResizeEnd}
            />
        )
    }
    const nextPosition = calPosition()
    const nextSize = calSize()
    const wrapperedChildren = React.cloneElement(
        React.Children.only(props.children) as React.ReactElement,
        {
            onMouseDown: onMouseDownWrapper, 
            onMouseUp: onMouseUpWrapper,
            onClick: handleShowResizeBar,
            onBlur: handleBlur,
            style: {
                ...style, 
                ...getStyle(nextPosition[0], nextPosition[1]),
                cursor: "move",
                width: nextSize.width || 'auto',
                height: nextSize.height || 'auto'
            }
        }
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