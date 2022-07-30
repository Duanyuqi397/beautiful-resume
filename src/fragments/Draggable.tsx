import { type } from '@testing-library/user-event/dist/type'
import * as React from 'react'
import { useState } from 'react'

type Position = [number, number]
type DraggableEventHandler = (position: Position) => void

type DragProps = React.PropsWithChildren<{
    onDrag?: DraggableEventHandler,
    position?: [number, number],
    defaultPosition?: [number, number],
    onDragEnd?: DraggableEventHandler
}>



function getStyle(x: number, y: number){
    return {
        transform: `translate(${x}px, ${y}px)`,
        transition: "null",
    }
}


const Draggable: React.FC<DragProps> = (props) => {
    const [position, setPosition] = useState<Position>(props.defaultPosition || [0, 0])
    const startPosition = React.useRef<Position>([0, 0])
    const mouseStartPosition = React.useRef<Position>([0, 0])
    const onDragStartRef = React.useRef(true)
    const eventRef = React.useRef(handleMouseMove)
    const children = props.children as React.ReactElement
    const onMouseDown = children.props.onMouseDown
    const onMouseUp = children.props.onMouseUp
    const style = children.props.style || {}

    React.useLayoutEffect(() => {
        props.position && setPosition(props.position)
    }, [props.position])

    React.useEffect(() => {
        return () => eventRef.current && document.body.removeEventListener('mousemove', eventRef.current)
    }, [])

    function calPosition(){
        return props.position || position
    }

    function handleMouseMove(e: MouseEvent){
        const [startX, startY] = calPosition()
        const [mouseStartX, mouseStartY] = mouseStartPosition.current
        const offsetX = e.clientX - mouseStartX
        const offsetY = e.clientY - mouseStartY
        const nextPosition: Position = [startX + offsetX, startY + offsetY]
        if(!props.position){
            setPosition(nextPosition)
        }
        props.onDrag && props.onDrag(nextPosition)
    }

    function onMouseDownWrapper(e: MouseEvent){
        eventRef.current = handleMouseMove
        startPosition.current = calPosition()
        mouseStartPosition.current = [e.clientX, e.clientY]
        document.body.addEventListener('mousemove', eventRef.current)
        onMouseDown && onMouseDown(e)
    }

    function onMouseUpWrapper(e: MouseEvent){
        if(eventRef.current !== null){
            document.body.removeEventListener('mousemove', eventRef.current)
        }
        const position = calPosition()
        props.onDragEnd && props.onDragEnd(position)
        onMouseUp && onMouseUp(e)
    }
    
    const wrapperedChildren = React.cloneElement(
            React.Children.only(props.children) as React.ReactElement,
            {
                onMouseDown: onMouseDownWrapper, 
                onMouseUp: onMouseUpWrapper,
                style: { 
                    ...style, 
                    ...getStyle(position[0], position[1])
                }
            }
        )
    
    return wrapperedChildren
}

export default Draggable;

export type {
    Position,
}