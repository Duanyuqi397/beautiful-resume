 
import * as React from 'react'


type MoveEvent = (offset: [number, number], e: MouseEvent) => void
type EndEvent = (e: MouseEvent) => void

function useEvent<T extends Function>(callback: T): T{
    const callbackRef = React.useRef(callback)
  
    React.useLayoutEffect(() => {
        callbackRef.current = callback
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useCallback(callbackRef.current, [])
}


export default function useMouseOffset(moveCallBack: MoveEvent, endCallBack: EndEvent){
    const startPositionRef = React.useRef<[number, number]>([0, 0])
    const movingRef = React.useRef(false)

    const mouseMove = useEvent((e: MouseEvent) => {
        const [startX, startY] = startPositionRef.current
        const offset: [number, number] = [e.pageX - startX, e.pageY - startY]
        moveCallBack(offset, e)
    })

    const mouseUp = useEvent((e: MouseEvent) => {
        stop()
        endCallBack(e)
    })

    function start(e: MouseEvent){
        if(!movingRef.current){
            movingRef.current = true
            startPositionRef.current = [e.pageX, e.pageY]
            document.body.addEventListener('mousemove', mouseMove)
            document.body.addEventListener('mouseup', mouseUp)
        }
    }

    function stop(){
        if(movingRef.current){
            movingRef.current = false
            document.body.removeEventListener('mousemove', mouseMove)
            document.body.removeEventListener('mouseup', mouseUp)
        }
    }

    return [
        () => movingRef.current,
        start,
        stop,
    ] as const
}