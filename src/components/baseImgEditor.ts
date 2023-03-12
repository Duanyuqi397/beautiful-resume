import { BASE_EDITOR_CONFIG, EDITORS } from "../scripts/constants"
import { EditorProps } from "../types/types"

const baseImgEditor = {
    name:'baseImgEditor',
    component: 'BaseImg',
config: {
        ...BASE_EDITOR_CONFIG,
        url: EditorProps.fromObject({
            name: "图片选择",
            type: EDITORS.uploader
        })
    }
}

export default baseImgEditor;