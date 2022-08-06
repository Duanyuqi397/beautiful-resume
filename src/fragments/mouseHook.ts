import * as React from 'react'



export default function useMouseOffset(callBack: (offset: [number, number], e: MouseEvent) => void){
    
    const startPositionRef = React.useRef<[number, number]>([0, 0])
    const movingRef = React.useRef(false)
    const moveEventRef = React.useRef<((e: MouseEvent) => void)|null>(null)

    function mouseMove(e: MouseEvent){
        const [startX, startY] = startPositionRef.current
        const offset: [number, number] = [e.pageX - startX, e.pageY - startY]
        callBack(offset, e)
    }

    function start(e: MouseEvent){
        if(movingRef.current){
            return
        }
        movingRef.current = true
        startPositionRef.current = [e.pageX, e.pageY]
        moveEventRef.current = mouseMove
        document.body.addEventListener('mousemove', mouseMove)
    }

    function stop(){
        console.info("stop")
        movingRef.current = false
        if(moveEventRef.current){
            document.body.removeEventListener('mousemove', moveEventRef.current)
        }
    }
    return [
        () => movingRef.current,
        start,
        stop,
    ] as const
}