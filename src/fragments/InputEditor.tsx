import { Input } from "antd";

type ReturnType = "string" | "number"

type InputEditors = {
    value: any,
    onChange: (value: any) => void
    returnType: ReturnType
}

function InputEditor(props: InputEditors){
    const {
        value,
        onChange,
        returnType
    } = props
    return (
        <Input
            value={value}
            onChange={(e) => {
                if(returnType === "number" && /^\d+$/.test(e.target.value)){
                    onChange(parseInt(e.target.value))
                }else{
                    onChange(e.target.value)
                }
            }}
        />
    )
}

export default InputEditor;