import * as React from 'react'


const  BaseContainer: React.FC<any> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const backgroundColor = props.style.backgroundColor || "rgba(0, 0, 0, 0.1)"
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
        </div>
    )
}

BaseContainer.defaultProps = {
    style: {
        width: 150,
        height: 150
    }
}

export default BaseContainer;