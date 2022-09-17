import * as React from 'react'
import { Divider } from 'antd'

const BaseDivider: React.FC<any> = (props: any) => {
    const hasContent = props.content?.length > 0
    return (
        hasContent ? <Divider {...props} >{props.content}</Divider> : <Divider {...props} children={null}/>
    )
}

BaseDivider.defaultProps = {
    style: {
        width: 350,
        minWidth: 50,
        borderBottomColor: "rgba(0,0,0,0.1)"
    },
    drag: {
        allowResizeDirection: ["left", "right"],
        disableArea: 0
    },
    plain: true
}

export default BaseDivider;