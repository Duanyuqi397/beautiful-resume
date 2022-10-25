import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AuxiliaryLineProps } from '../core/types/'
import { useAlign } from '../core/hooks'

function Line(props: {style: React.CSSProperties}){
    return (
        <div
            style={{
                zIndex: 0,
                position: 'absolute',
                ...props.style
            }}
        >
        </div>
    )
}

function makeLine(line: AuxiliaryLineProps, key: number){
    const color = line.color ?? 'rgb(41, 182, 242)'
    if(line.offset === -1){
        return null
    }
    if(line.axis === "x"){
        return <Line key={key} style={{left: line.offset - 1, width: '1px', height: '100%', backgroundColor: color}}/>
    }else if(line.axis === "y"){
        return <Line key={key} style={{top: line.offset - 1, height: '1px', width: '100%', backgroundColor: color}}/>
    }
}

const AuxiliaryLine: React.FC<{container: HTMLElement | undefined}> = (props) => {
    const getAligns = useAlign()
    const lines = getAligns()
    const lineElements = lines.map(makeLine)
    return props.container ? ReactDOM.createPortal(lineElements, props.container) : null
}

export default AuxiliaryLine