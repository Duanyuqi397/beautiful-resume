import { EditorType, EditorProps } from "../types/types";
import {Rule} from "antd/lib/form"
import { CSSProperties } from "react";

const EDITORS = {
    input: "Input" as EditorType,
    richText: "RichText" as EditorType,
    select: "Select" as EditorType,
    uploader: "Uploader" as EditorType,
    position: "position" as EditorType,
    colorPicker: "colorPicker" as EditorType,
    image: "image" as EditorType,
    textArea: "TextArea" as EditorType
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

const FIELDS = {
    width: EditorProps.fromObject({
        name: "宽度",
        type: EDITORS.input,
        validateRules: [Validtors.required, Validtors.number],
        group: "样式",
        otherProps: {returnType: "number"},
    }),
    height: EditorProps.fromObject({
        name: "高度",
        type: EDITORS.input,
        validateRules: [Validtors.required, Validtors.number],
        group: "样式",
        otherProps: {returnType: "number"},
    }),
    backgroundColor: EditorProps.fromObject({
        name: "填充",
        group: "背景",
        type: EDITORS.colorPicker,
    }),
    borderWidth: EditorProps.fromObject({
        name: "线条宽度",
        type: EDITORS.input,
        defaultValue: 0,
        group: "边框",
        otherProps: {
           addonAfter: "px",
           isNumber: true,
           min: 0
        }
    }),
    borderStyle: EditorProps.fromObject({
        name: "线型",
        type: EDITORS.select,
        defaultValue: "none",
        group: "边框",
        otherProps: {
            options: [
                {
                    name: "无线条",
                    value: "none"
                },
                {
                    name: "——————",
                    value: "solid"
                },
                {
                    name: "-----",
                    value: "dashed"
                },
                {
                    name: ".....",
                    value: "dotted"
                }
            ]
        }
    }),
    borderRadius: EditorProps.fromObject({
        name: "圆角",
        type: EDITORS.input,
        group: "样式"
    }),
    zIndex: EditorProps.fromObject({
        name: "层级",
        type: EDITORS.input,
        group: "位置",
        defaultValue: 0,
        otherProps: {
            isNumber: true,
            addonAfter: ""
        }
    }),
    plainText: EditorProps.fromObject({
        name: "内容",
        type: EDITORS.input,
        group: ""
    }),
    customStyle: EditorProps.fromObject({
        name: "自定义样式",
        defaultValue: {},
        type: EDITORS.input
    })
}

const BASE_EDITOR_CONFIG: {
    style: {
        [P in keyof CSSProperties]: EditorProps
    },
    customStyle?: EditorProps
} = {
    style: {
        borderRadius: FIELDS.borderRadius,
        zIndex: FIELDS.zIndex,
        // width: FIELDS.width,
        // height: FIELDS.height,
        backgroundColor: FIELDS.backgroundColor,
        borderWidth: FIELDS.borderWidth,
        borderStyle: FIELDS.borderStyle, 
        // ...FIELDS.customStyle
    },
    customStyle: EditorProps.fromObject({
        name: "自定义样式",
        group: "样式",
        type: EDITORS.input
    })
}

export {
    EDITORS,
    FIELDS,
    BASE_EDITOR_CONFIG
}