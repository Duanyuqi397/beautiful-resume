import { Editor, EditorProps } from "../types/types";
import { BASE_EDITOR_CONFIG, EDITORS } from "../scripts/constants"

const baseTextArea: Editor = {
    name:'baseTextArea',
    component: 'BaseTextArea',
    config: {
        ...BASE_EDITOR_CONFIG,
        content: EditorProps.fromObject({
            name: "内容",
            type: EDITORS.richText
        })
    }
}

export default baseTextArea;