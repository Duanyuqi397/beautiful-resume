import { EditorType, EditorProps } from "../types/types";
import {Rule} from "antd/lib/form"

const EDITORS = {
     input: "Input" as EditorType,
     richText: "RichText" as EditorType
}

const Validtors = {
    number: {
        message: "${label}需要为数字",
        pattern: new RegExp("^\\d+$")
    } as Rule,
    required: {
        required: true,
        message: "${label}不能为空"
    } as Rule
}

const FIELDS: Record<string, EditorProps> = {
    width: EditorProps.fromObject({
        name: "长度",
        type: EDITORS.input,
        validateRules: [Validtors.required, Validtors.number],
        otherProps: {returnType: "number"},
    }),
    height: EditorProps.fromObject({
        name: "宽度",
        type: EDITORS.input,
        validateRules: [Validtors.required, Validtors.number],
        otherProps: {returnType: "number"},
    }),
    backgroundColor: EditorProps.fromObject({
        name: "填充",
        type: EDITORS.input,
    }),
    border: EditorProps.fromObject({
        name: "线条",
        type: EDITORS.input,
    })
}

const BASE_EDITOR_CONFIG = {
    style: {
        width: FIELDS.width,
        height: FIELDS.height,
        backgroundColor: FIELDS.backgroundColor,
        border: FIELDS.border,
    }
}

export {
    EDITORS,
    FIELDS,
    BASE_EDITOR_CONFIG
}