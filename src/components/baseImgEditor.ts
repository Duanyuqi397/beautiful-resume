import { BASE_EDITOR_CONFIG, EDITORS } from "../scripts/constants"
import { EditorProps } from "../types/types"

const baseImgEditor = {
    name:'baseImgEditor',
    component: 'BaseImg',
    config: {
        ...BASE_EDITOR_CONFIG,
        url: EditorProps.fromObject({
            name: "上传图片",
            type: EDITORS.input
        })
    }
}

export default baseImgEditor;