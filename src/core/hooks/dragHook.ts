import { useRef } from 'react'
import { Position, PositionChangeEventHandler, MouseOffset } from '../types'
import { useMouseOffset } from './mouseHook'

function useDrag(
    onDrag: PositionChangeEventHandler,
    onDragEnd?: PositionChangeEventHandler,
    grad: number = 1,
) {
    const startPositionRef = useRef<Position[]>()
    const [start, inDrag] = useMouseOffset(
        handleMouseMoving,
        handleMouseStop,
        grad,
    )

    function calPositionByOffset(positions: Position[], offset: MouseOffset){
        const [offsetX, offsetY] = offset
        return positions.map(([x, y]) => [x + offsetX, y + offsetY] as Position)
    }

    function handleMouseMoving(offset: MouseOffset){
        if(startPositionRef.current){
            const newPositions = calPositionByOffset(startPositionRef.current, offset)
            onDrag(newPositions)
        }
    }

    function handleMouseStop(offset: MouseOffset, e: MouseEvent){
        if(startPositionRef.current){
            const newPositions = calPositionByOffset(startPositionRef.current, offset)
            onDragEnd && onDragEnd(newPositions)
            stopDrag()
        }
    }

   
    function startDarg(startPosition: Position[], e: MouseEvent){
        if(startPositionRef.current){
            return
        }
        startPositionRef.current = startPosition
        start(e)
    }

    function stopDrag(){
        startPositionRef.current = undefined
    }

    return [startDarg, inDrag] as const
}

export default useDrag