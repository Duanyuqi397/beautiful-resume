import * as React from 'react'
import { Cprops } from "../types/types";
import {removeKeys} from '../scripts/utils'

type RichTextContainerProps = Cprops & {
    html: string
}

function getBackgroundColor(text: string|undefined, backgroundColor: string|undefined){
    if((text && text?.length > 0) || backgroundColor){
        return backgroundColor
    }else {
        return "rgba(0, 0, 0, 0.1)"
    }
}

const  BaseTextArea: React.FC<any> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const backgroundColor = getBackgroundColor(props.content?.text, props.style.backgroundColor)
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
                draggable={false}
                style={{width: "100%", height: "100%", userSelect: "none"}}
                dangerouslySetInnerHTML={{__html: props.content.html}} 
            >
            </div>
        </div>
    )
}

BaseTextArea.defaultProps = {
    size: [150, 150],
    content: {
        html: "",
        text: ""
    }
}

export default BaseTextArea;