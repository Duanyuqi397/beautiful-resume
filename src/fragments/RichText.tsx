import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { useState, useEffect, useRef } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { Button, Modal} from 'antd'
import { BaseEditorProps } from '../types/types'
import { EditFilled } from '@ant-design/icons'

type RichTextProps = BaseEditorProps<{text: string, html: string}> & {
    toolbarConfigs?: IToolbarConfig,
    editorConfigs?: IEditorConfig
}

const defaultHtml = `<p style="line-height: 1; text-align: left;"><span style="font-size: 14px; font-family: 微软雅黑;"></span></p>`

function InnerEditor(props: RichTextProps){
    const {
        onChange = () => {},
        toolbarConfigs = {},
        editorConfigs = {},
        value
    } = props

    const [editor, setEditor] = useState<IDomEditor | null>(null)

    const initHtml = value?.html === '' ? defaultHtml: value?.html

    const handleChange 
                    = (editor: IDomEditor) => onChange({html: editor.getHtml(), text: editor.getText()})

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
            if(editor !== null){
                editor.destroy()
            }
        }
    }, [editor])

    return (
        <>
            <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #ccc' }}
            />
            <Editor
                defaultHtml={initHtml}
                defaultConfig={editorConfig}
                value={value?.html}
                onCreated={setEditor}
                onChange={handleChange}
                style={{ height: '500px', overflowY: 'hidden' }}
            />
        </>
    )
}

function RichText(props: RichTextProps) {
    const [showEditor, setShowEditor] = useState(false)
    const closeEditor = () => setShowEditor(false)
    const openEditor = () => setShowEditor(true)
    return (
            showEditor ? 
                (
                    <Modal
                        width={"50%"}
                        open={showEditor}
                        onOk={closeEditor}
                        onCancel={closeEditor}
                        footer={[
                            <Button key="submit" onClick={closeEditor}>
                                完成
                            </Button>
                        ]}
                    >
                       <InnerEditor {...props} />
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