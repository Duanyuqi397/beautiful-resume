import { FIELDS, EDITORS } from "../scripts/constants"
import { EditorProps } from '../types/types'

const baseDividerEditor = {
    name:'baseDiverderEditor',
    component: 'BaseDivider',
    config: {
        style: {
            width: FIELDS.width,
            borderBottomColor: FIELDS.backgroundColor.mergeProps({defaultValue: "rgba(0,0,0,0.1)"})
        },
        dashed: EditorProps.fromObject({
            name: "是否虚线",
            defaultValue: false,
            type: EDITORS.select,
            group: "样式",
            otherProps: {
                options: [
                    {name: "是", value: true},
                    {name: "否", value: false}
                ]
            }
        }),
        content: EditorProps.fromObject({
            name: "文本",
            type: EDITORS.input,
            group: "内容"
        }),
        orientation: EditorProps.fromObject({
            name: "文本位置",
            defaultValue: "center",
            type: EDITORS.select,
            group: "内容",
            otherProps: {
                options: [
                    {name: "居中", value: "center"},
                    {name: "靠左", value: "left"},
                    {name: "靠右", value: "right"}
                ]
            }
        })
    }
}

export default baseDividerEditor;