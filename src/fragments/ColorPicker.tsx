import * as React from 'react'
import { BaseEditorProps } from '../types/types'
import { SketchPicker } from 'react-color';
import { Popover, Button} from 'antd'

type ColorPickerProps = BaseEditorProps

function getRgba(color: any): string{
    return `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
    const [open, setOpen] = React.useState(false)
    const [color, setColor] = React.useState<any>("")
    return (
        <Popover 
            open = {open}
            placement="top" 
            content={
                <SketchPicker
                    onChange = {(color) => {
                        const rgba = getRgba(color)
                        props.onChange(rgba)
                        setColor(rgba)
                    }}
                    color={color}
                />
            }
            onOpenChange={(e) => setOpen(e)}
        >
            <div
                style={{
                    backgroundColor: color || '#e5e5e5',
                    width: '20px',
                    height: '20px',
                    border: '1px solid black'
                }}
                //onClick={() => setOpen(!open)}
            />
        </Popover>
        
    )
}

export default ColorPicker