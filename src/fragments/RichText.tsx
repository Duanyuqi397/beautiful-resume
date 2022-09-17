import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Button, Modal} from 'antd'
import { BaseEditorProps } from '../types/types'
import { EditFilled } from '@ant-design/icons'
type RichTextProps = BaseEditorProps<{text: string, html: string}> & {
    toolbarConfigs?: IToolbarConfig,
    editorConfigs?: IEditorConfig
}

const initFormat = [
    {
      type: 'paragraph',
      lineHeight: '0.6',
      children: [
        { text: '', fontFamily: '默认字体', fontSize: '12px' }
      ],
      textAlign: "left"
    },
]


function RichText(props: RichTextProps) {
    const [showEditor, setShowEditor] = useState(false)
    const {
        onChange = () => {},
        toolbarConfigs = {},
        editorConfigs = {}
    } = props

    const [editor, setEditor] = useState<IDomEditor | null>(null)

    const toolbarConfig: Partial<IToolbarConfig> = { 
        excludeKeys: [
            'group-image',
            'group-video'
        ],
        ...toolbarConfigs
    } 

    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
        ...editorConfigs
    }

    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    const closeEditor = () => setShowEditor(false)
    const openEditor = () => setShowEditor(true)
    const handleChange 
                    = (editor: IDomEditor) => onChange({html: editor.getHtml(), text: editor.getText()})

    return (
            showEditor ? 
                (
                    <Modal
                        width={"50%"}
                        visible={showEditor}
                        onOk={closeEditor}
                        onCancel={closeEditor}
                        footer={[
                            <Button key="submit" onClick={closeEditor}>
                                完成
                            </Button>
                        ]}
                    >
                       <>
                            <Toolbar
                                editor={editor}
                                defaultConfig={toolbarConfig}
                                mode="default"
                                style={{ borderBottom: '1px solid #ccc' }}
                            />
                            <Editor
                                defaultContent={initFormat}
                                defaultConfig={editorConfig}
                                value={props.value?.html}
                                onCreated={setEditor}
                                onChange={handleChange}
                                style={{ height: '500px', overflowY: 'hidden' }}
                            />
                       </>
                    </Modal>
                )
                : (
                    <Button 
                        onClick={openEditor}
                        type="text"
                        block
                    > 
                        <EditFilled/>
                        点击编辑 
                    </Button>
                )
    )
}

export default RichText;