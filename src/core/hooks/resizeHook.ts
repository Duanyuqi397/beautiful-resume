import { useRef } from 'react'
import { Position, 
         SizeChangeEventHandler, 
         MouseOffset, 
         ResizeDirection,
         Size,
         BoxProps,
        } from '../types'
import { useMouseOffset } from './mouseHook'

function useResize(
    onResize: SizeChangeEventHandler,
    onResizeEnd?: SizeChangeEventHandler,
    keepRatio: boolean = false,
    grad: number = 1,
) {
    const boxRef = useRef<BoxProps>()
    const directionRef = useRef<ResizeDirection>()
    const [start, inMove] = useMouseOffset(
        handleMouseMoving,
        handleMouseStop,
        grad,
    )
    function calSizeByOffset(offset: MouseOffset){
        const direction = directionRef.current as ResizeDirection
        const startPosition = boxRef.current?.position as Position
        const startSize = boxRef.current?.size as Size
        const [offsetWidth, offsetHeight] = calSizeOffsetByDirection(offset, direction)
        const [startWidth, startHeight] = startSize
        let newWidth = startWidth + offsetWidth
        let newHeight = startHeight + offsetHeight

        if(keepRatio){
            const ratio = startWidth / startHeight
            if(direction.includes("left") || direction.includes("right")){
                newHeight = newWidth / ratio
            }else{
                newWidth = newHeight * ratio
            }
        }

        const posOffset = [newWidth - startWidth, newHeight - startHeight] as Position

        let [newX, newY] = startPosition
      
        if(directionRef.current?.includes("left")){    
            newX = newX - posOffset[0]
        }
        if(directionRef.current?.includes("up")){
            newY = newY - posOffset[1]
        }
        return {
            position: [newX, newY],
            size: [newWidth, newHeight]
        } as BoxProps
    }

    function handleMouseMoving(offset: MouseOffset){
        if(boxRef.current){
            const newBox = calSizeByOffset(offset)
            onResize(newBox)
        }
    }

    function handleMouseStop(offset: MouseOffset, e: MouseEvent){
        if(boxRef.current){
            const newBox = calSizeByOffset(offset)
            onResizeEnd && onResizeEnd(newBox)
            boxRef.current = undefined
        }
    }

    function startResize(box: BoxProps, e: MouseEvent, direction: ResizeDirection){
        if(boxRef.current){
            return
        }
        boxRef.current = box
        directionRef.current = direction
        start(e)
    }

    return [
        startResize,
        inMove
    ] as const
}

function calSizeOffsetByDirection(offset: Position, direction: ResizeDirection): MouseOffset{
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

export default useResize