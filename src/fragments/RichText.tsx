import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Button, Modal} from 'antd'

type RichTextProps = {
    onChange?: (html: string) => void,
    value?: string,
    toolbarConfigs?: IToolbarConfig,
    editorConfigs?: IEditorConfig
}

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

    return (
        
            showEditor ? 
                (
                    <Modal
                        width={"50%"}
                        visible={showEditor}
                        onOk={() => setShowEditor(false)}
                        onCancel={() => setShowEditor(false)}
                        footer={false}
                    >
                       <>
                        <Toolbar
                                editor={editor}
                                defaultConfig={toolbarConfig}
                                mode="default"
                                style={{ borderBottom: '1px solid #ccc' }}
                            />
                            <Editor
                                defaultConfig={editorConfig}
                                value={props.value}
                                onCreated={setEditor}
                                onChange={(editor) => onChange(editor.getHtml())}
                                style={{ height: '500px', overflowY: 'hidden' }}
                            />
                       </>
                    </Modal>
                )
                : (
                    <Button 
                        onClick={() => setShowEditor(true)}
                        type="text"
                        block
                    > 
                        点击编辑 
                    </Button>
                )
    )
}

export default RichText;