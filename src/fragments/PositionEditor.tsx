
import { Button, InputNumber, Radio } from 'antd'
import * as React from 'react'
import { BaseEditorProps } from '../types/types'
import {
        VerticalLeftOutlined,
        VerticalRightOutlined,
        VerticalAlignTopOutlined,
        VerticalAlignBottomOutlined,
        AlignLeftOutlined,
        AlignRightOutlined
    } from '@ant-design/icons'

type PositionEditorProps = BaseEditorProps<[number, number]> & {
    type: 'vertical'| 'horizontal'
}

const addons = {
    vertical: [<VerticalRightOutlined/>, <VerticalLeftOutlined />],
    horizontal: [<VerticalAlignTopOutlined/>, <VerticalAlignBottomOutlined/>]
}

const PositionEditor: React.FC<PositionEditorProps> = (props) => {
    const {
        value,
        onChange,
        type,
        otherProps
    } = props
    const [x, y] = value as [number, number]
    return (
        <>
            <InputNumber
                onChange={(value) => onChange([value, y])}
                value={x}
                addonBefore="x"
                addonAfter="px"
            />
            <InputNumber
                onChange={(value) => onChange([x, value])}
                value={y}
                addonBefore="y"
                addonAfter="px"
            />
        </>
    )
}

export default PositionEditor