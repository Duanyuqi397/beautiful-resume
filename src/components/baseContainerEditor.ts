import { Editor, EditorProps } from "../types/types";
import { BASE_EDITOR_CONFIG, EDITORS } from "../scripts/constants"

const editor: Editor = {
    name:'baseContainerEditor',
    component: 'BaseContainer',
    config: {
        ...BASE_EDITOR_CONFIG
    }
}

export default editor;