import * as React from 'react'
import { useEvent } from './eventHook'
import type { Position, MouseOffset, MouseEventHandler } from '../types'

function calGrid(value: number, grip: number){
    return Math.floor(value / grip) * grip
}

function useMouseOffset(
        moveCallBack: MouseEventHandler,
        endCallBack: MouseEventHandler,
        grid: number = 1,
    ) {
    const startPositionRef = React.useRef<Position>([0, 0])
    const movingRef = React.useRef(false)

    function getOffset(mousePosition: Position){
        const [startX, startY] = startPositionRef.current
        const [mouseX, mouseY] = mousePosition
        return [calGrid(mouseX - startX, grid), calGrid(mouseY - startY, grid)] as MouseOffset
    }

    const mouseMove = useEvent((e: MouseEvent) => {
        const offset = getOffset([e.pageX, e.pageY])
        moveCallBack(offset, e)
    })

    const mouseUp = useEvent((e: MouseEvent) => {
        const offset = getOffset([e.pageX, e.pageY])
        endCallBack(offset, e)
        stop()
    })

    React.useEffect(() => {
        return () => {
            document.body.removeEventListener('mouseup', mouseUp)
            document.body.removeEventListener('mousemove', mouseMove)
        }
    }, [mouseMove, mouseUp])

    function start(e: MouseEvent){
        if(!movingRef.current){
            movingRef.current = true
            startPositionRef.current = [e.pageX, e.pageY]
            document.body.style.userSelect = 'none'
            document.body.addEventListener('mousemove', mouseMove)
            document.body.addEventListener('mouseup', mouseUp)
        }
    }

    function stop(){
        if(movingRef.current){
            movingRef.current = false
            document.body.style.userSelect = 'initial'
            document.body.removeEventListener('mousemove', mouseMove)
            document.body.removeEventListener('mouseup', mouseUp)
        }
    }

    return [
        start,
        () => movingRef.current,
    ] as const
}

export {
    useMouseOffset
}