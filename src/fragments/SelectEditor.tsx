import { Checkbox, Select } from "antd";
import { CSSProperties, useState } from "react";
import { BaseEditorProps } from '../types/types'
import { parseBorder } from '../scripts/utils'
import Form, { useForm } from "antd/lib/form/Form";
import { type } from "@testing-library/user-event/dist/type";

type SelectEditorProps = BaseEditorProps<any> & {
    options: {name: any, value: any}[] | (() => ({name: any, value: any}[]))
    defaultValue?: any,
    multiple?: boolean
}

const { Option } = Select

function SelectEditor(props: SelectEditorProps){
    const {
        onChange,
        value,
        options,
        multiple = false
    } = props

    const caledOptions = typeof options === "function" ? options() : options

    return (
        <Select
            onChange={onChange}
            value={value}
            mode={multiple ? "multiple": undefined}
        >
            {
                caledOptions.map(option => <Option key={option.value + option.name} value={option.value}>{option.name}</Option>)
            } 
        </Select>
    )
}

export default SelectEditor;