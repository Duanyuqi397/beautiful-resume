import { useApp } from './appHook'
import { AuxiliaryLineProps } from '../types'

function calGridMiddle(start: number, end: number){
    return start + Math.floor((end - start) / 2)
}

function useAlign(){
    const { components } = useApp()
    function getAuxlines(): AuxiliaryLineProps[] {
        const dragOrReiszeComponents = components.filter(c => c.state === "drag" || c.state === "resize")
        if(dragOrReiszeComponents.length !== 1){
            return []
        }
        const moveComponent = dragOrReiszeComponents[0]
        const [transateX, tarnsateY] = moveComponent.props.position
        const [width, height] = moveComponent.props.size
        const absLeft = transateX;
        const absTop = tarnsateY;
        const absRight = absLeft + width
        const absBottom = absTop + height

        const alignXCenter = absLeft + Math.floor((absRight - absLeft) / 2)
        const alignYCenter = absTop + Math.floor((absBottom - absTop) / 2)

        const aligns: AuxiliaryLineProps[] = []
        for (const component of components) {
            if (component.id === moveComponent.id) {
                continue
            }
            const [left, top] = component.props.position
            const [width, height] = component.props.size
            const right = left + width
            const bottom = top + height  

            const xCenter = calGridMiddle(left, right)
            const yCenter = calGridMiddle(top, bottom)
            
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
        return aligns
    }
    return getAuxlines
}

export default useAlign