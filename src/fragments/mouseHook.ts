 
import * as React from 'react'
import useEvent from './eventHook'

type MoveEvent = (offset: [number, number], e: MouseEvent) => void
type EndEvent = (e: MouseEvent) => void

function calGrid(value: number, grip: number){
    return Math.floor(value / grip) * grip
}

export default function useMouseOffset(moveCallBack: MoveEvent, endCallBack: EndEvent, grid: number=1){
    const startPositionRef = React.useRef<[number, number]>([0, 0])
    const movingRef = React.useRef(false)

    const mouseMove = useEvent((e: MouseEvent) => {
        const [startX, startY] = startPositionRef.current
        const offset: [number, number] = [calGrid(e.pageX - startX, grid), calGrid(e.pageY - startY, grid)]
        moveCallBack(offset, e)
    })

    const mouseUp = useEvent((e: MouseEvent) => {
        stop()
        endCallBack(e)
    })

    const mouseLeave = useEvent((e: MouseEvent) => {
        if(e.currentTarget === document){
            mouseUp(e)
        }
    })

    React.useEffect(() => {
        return () => {
            document.body.removeEventListener('mouseup', mouseUp)
            document.body.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('mouseleave', mouseLeave)
        }
    }, [mouseMove, mouseUp, mouseLeave])

    function start(e: MouseEvent){
        if(!movingRef.current){
            movingRef.current = true
            startPositionRef.current = [e.pageX, e.pageY]
            document.body.style.userSelect = 'none'
            document.body.addEventListener('mousemove', mouseMove)
            document.body.addEventListener('mouseup', mouseUp)
            document.addEventListener('mouseleave', mouseLeave)
        }
    }

    function stop(){
        if(movingRef.current){
            movingRef.current = false
            document.body.style.userSelect = 'initial'
            document.body.removeEventListener('mousemove', mouseMove)
            document.body.removeEventListener('mouseup', mouseUp)
            document.removeEventListener('mouseleave', mouseLeave)
        }
    }

    return [
        () => movingRef.current,
        start,
        stop,
    ] as const
}