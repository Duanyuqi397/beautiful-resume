import { Input, InputNumber } from "antd";
import { BaseEditorProps } from '../types/types'

type ReturnType = "string" | "number"

type InputEditors = BaseEditorProps & {
    returnType: ReturnType,
    isNumber?: boolean,
    initialValue?: any
}

function InputEditor(props: InputEditors){
    const {
        value,
        onChange,
        returnType,
        isNumber = false,
        ...others
    } = props
    return (
        isNumber ? (
            <InputNumber
                value={value}
                onChange={onChange}
                {...others}
            />
        )
        :
        (
            <Input
                value={value}
                onChange={(e) => {
                    if(returnType === "number" && /^\d+$/.test(e.target.value)){
                        onChange(parseInt(e.target.value))
                    }else{
                        onChange(e.target.value)
                    }
                }}
                {...others}
            />
        )
    )
}

export default InputEditor;