import { Button, Divider, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { Component, Cprops, EditorType } from "../types/types";
import { getEditableProps, mergeProps } from "./configEngine";
import RichText from "./RichText";
import InputEditor from "./InputEditor";
import SelectEditor from "./SelectEditor";
import ImageEditor from "./ImageEditor";
import { EDITORS } from "../scripts/constants";
import * as utils from "../scripts/utils"
import { ConfigPath } from "../scripts/utils";
import * as React from 'react'

const editorMapping = {
  [EDITORS.input]: InputEditor,
  [EDITORS.richText]: RichText,
  [EDITORS.select]: SelectEditor,
  [EDITORS.uploader]: ImageEditor
}

function getEachItem(item: ConfigPath){
  return (
        <Form.Item
                shouldUpdate={(prevValues, curValues) => prevValues !== curValues}
                label={item.config.name}
                key={item.path.join("-")}
                name={item.path}
                rules={item.config.validateRules}
                initialValue={item.config.defaultValue}
              >
                {
                  React.createElement(editorMapping[item.config.type] as any, item.config.otherProps)
                }
        </Form.Item>
  )
}

function flatConfigs(configs: [string, ConfigPath[]]){
  const [groupName, items] = configs
  const components = items.map(getEachItem)
  const line = <Divider key={groupName} plain style={{color: "#999494", fontWeight: 'lighter'}}>{groupName}</Divider>
  return [line, ...components]
}
const formItemLayout = {
  labelCol: { span: 8},
  wrapperCol: { span: 16, offset: 1},
}

function ConfigPanel(props: {updateFn: any, component: Component, currentEditor: Record<string, any>}) {
  const { updateFn, component, currentEditor } = props;
  const componentProps = component.props
  const [form] = useForm();

  const onReset = () => {
    form.resetFields()
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(componentProps)
  }, [component.id, component.props.style.width, component.props.style.height])
  //}, [component.id])

  const submit = utils.debounce(form.submit, 300)

  const flaternConfigs = utils.flatConfigs(currentEditor)
  const groupedConfigs = Object.entries(utils.groupBy(flaternConfigs, (configPath) => configPath.config.group ?? ""))
  const configItems = groupedConfigs.map(flatConfigs)

  return (
    <Form 
      {...formItemLayout}
      name="config-panel" 
      form={form} 
      initialValues={componentProps}
      onFinish={(values) => {
        const newValues = utils.merge(component.props, values)
        updateFn(newValues)
      }}
      onFinishFailed={(err) => console.info('validate error', err)}
      onValuesChange={submit}    
    >
      {
        configItems
      }
      {/* {keys.length !== 0 && (
        <div>
          <Row justify="space-between" align="middle" style={{padding: '0 40px'}} >
            <Form.Item>
              <Button style={{ margin: "0 4px" }} onClick={onReset}>还原</Button>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">保存</Button>
            </Form.Item>
          </Row>
        </div>
      )} */}
    </Form>
  );
}

export default ConfigPanel;
