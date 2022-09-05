import * as React from 'react'
import * as ReactDOM from 'react-dom'
type AuxiliaryLineProps = {
    axis: "x"|"y",
    offset: number,
    color?: "string"
}

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

const AuxiliaryLine: React.FC<{lines: AuxiliaryLineProps[]}> = (props) => {
    const lineElements = props.lines.map(makeLine)
    return ReactDOM.createPortal(lineElements, document.getElementById("root-container") as HTMLElement)
}

export default AuxiliaryLine
export type {AuxiliaryLineProps}