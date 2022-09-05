import * as React from 'react'
import {AuxiliaryLineProps} from './AuxiliaryLine'
import {useArray} from './dataHook'

type ComponentBox = [number, number, number, number]

function calGridMiddle(start: number, end: number){
    return start + Math.floor((end - start) / 2)
}

function useAlign(initPosition?: ComponentBox) {
    const init = initPosition ? new Map([["", initPosition]]) : new Map()
    const componentPositions = React.useRef<Map<string, ComponentBox>>(init)
    const [alignPositions, setAlignPositions] = React.useState<AuxiliaryLineProps[]>([])

    function setPosition(componetId: string, activeComponentPosition: ComponentBox){
        componentPositions.current.set(componetId, activeComponentPosition)
    }

    function calAlign(componetId: string, activeComponentPosition: ComponentBox) {
        const [absLeft, absRight, absTop, absButtom] = activeComponentPosition
        const alignXCenter = absLeft + Math.floor((absRight - absLeft) / 2)
        const alignYCenter = absTop + Math.floor((absButtom - absTop) / 2)

        const aligns: AuxiliaryLineProps[] = []
        for (const otherId of componentPositions.current.keys()) {
            const [left, right, top, bottom] = componentPositions.current.get(otherId) as ComponentBox

            const xCenter = calGridMiddle(left, right)
            const yCenter = calGridMiddle(top, bottom)
            
            if (otherId === componetId) {
                continue
            }
            if (aligns.length >= 6) {
                break
            }
            if(absLeft === left || absRight === right){
                if (absLeft === left) {
                    aligns.push({axis: "x", offset: left})
                }  
                if (absRight === right) {
                    aligns.push({axis: "x", offset: right})
                }
            }else if (alignXCenter === xCenter) {
                aligns.push({axis: "x", offset: xCenter})
            }  
            
            if(absTop === top || absButtom === bottom){
                if (absTop === top) {
                    aligns.push({axis: "y", offset: top})
                }  
                if (absButtom === bottom) {
                    aligns.push({axis: "y", offset: bottom})
                }
            }else if (alignYCenter === yCenter) {
                aligns.push({axis: "y", offset: yCenter})
            }   
        }
        setAlignPositions(aligns)
        setPosition(componetId, [absLeft, absRight, absTop, absButtom])
    }

    function resetAlign(){
        setAlignPositions([])
    }

    function hasAlign(){
        return alignPositions.length > 0
    }

    function removeAlign(key: string){
        componentPositions.current.delete(key)
    }

    return {
        alignPositions,
        calAlign,
        resetAlign,
        setPosition,
        hasAlign,
        removeAlign
    }
}

export default useAlign;
