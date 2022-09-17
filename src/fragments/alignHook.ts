import * as React from 'react'
import { Component } from '../types/types'
import {AuxiliaryLineProps} from './AuxiliaryLine'
import {useArray} from './dataHook'
import { parseNumberFromStyle } from '../scripts/utils'

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

    function calAlign(componentId: string, position: [number, number], size: {width: number, height: number}) {
        
        const [transateX, tarnsateY] = position as any;

        const absLeft = transateX;
        const absTop = tarnsateY;
        const absRight = absLeft + parseNumberFromStyle(size.width);
        const absBottom = absTop + parseNumberFromStyle(size.height);

        const alignXCenter = absLeft + Math.floor((absRight - absLeft) / 2)
        const alignYCenter = absTop + Math.floor((absBottom - absTop) / 2)

        const aligns: AuxiliaryLineProps[] = []
        for (const otherId of componentPositions.current.keys()) {
            const [left, right, top, bottom] = componentPositions.current.get(otherId) as ComponentBox

            const xCenter = calGridMiddle(left, right)
            const yCenter = calGridMiddle(top, bottom)
            
            if (otherId === componentId) {
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
            
            if(absTop === top || absBottom === bottom){
                if (absTop === top) {
                    aligns.push({axis: "y", offset: top})
                }  
                if (absBottom === bottom) {
                    aligns.push({axis: "y", offset: bottom})
                }
            }else if (alignYCenter === yCenter) {
                aligns.push({axis: "y", offset: yCenter})
            }   
        }
        setAlignPositions(aligns)
        setPosition(componentId, [absLeft, absRight, absTop, absBottom])
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
