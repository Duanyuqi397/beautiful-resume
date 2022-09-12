import * as React from 'react'
import { Cprops } from "../types/types";
import {removeKeys} from '../scripts/utils'

type RichTextContainerProps = Cprops & {
    html: string
}

function getBackgroundColor(html: string|undefined, backgroundColor: string|undefined){
    if(html || backgroundColor){
        return backgroundColor
    }else {
        return "rgba(0, 0, 0, 0.1)"
    }
}

const  BaseTextArea: React.FC<any> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const backgroundColor = getBackgroundColor(props.html, props.style.backgroundColor)
    return (
        <div
            ref={ref}
            tabIndex={-1}
            onClick={props.onClick} 
            onBlur={props.onBlur}
            onMouseDown={props.onMouseDown} 
            onMouseUp={props.onMouseUp}
            style={{...props.style, backgroundColor}}
        >
            <div
                style={{width: "100%", height: "100%"}}
                dangerouslySetInnerHTML={{__html: props.html}} 
            >
            </div>
        </div>
    )
}

BaseTextArea.defaultProps = {
    style: {
        width: 150,
        height: 50
    },
    html: ""
}

export default BaseTextArea;