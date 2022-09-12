import { Button, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { Component, Cprops, EditorType } from "../types/types";
import { getEditableProps, mergeProps } from "./configEngine";
import RichText from "./RichText";
import InputEditor from "./InputEditor";
import { EDITORS } from "../scripts/constants";
import * as utils from "../scripts/utils"
import * as React from 'react'

const editorMapping = {
  [EDITORS.input]: InputEditor,
  [EDITORS.richText]: RichText
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
  }, [component.id])

  const submit = utils.debounce(form.submit, 300)

  const flaternConfigs = utils.flatConfigs(currentEditor)
  return (
    <Form 
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
       flaternConfigs
          .map((item) => (
              <Form.Item
                shouldUpdate={(prevValues, curValues) => prevValues !== curValues}
                label={item.config.name}
                key={item.path.join("-")}
                name={item.path}
                rules={item.config.validateRules}
              >
                {
                  React.createElement(editorMapping[item.config.type] as any, item.config.otherProps)
                }
              </Form.Item>
          ))
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
