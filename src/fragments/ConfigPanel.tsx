import { Button, Divider, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { Component, Cprops, EditorType } from "../types/types";
import { getEditableProps, mergeProps } from "./configEngine";
import RichText from "./RichText";
import InputEditor from "./InputEditor";
import SelectEditor from "./SelectEditor";
import ImageEditor from "./ImageEditor";
import PositionEditor from "./PositionEditor";
import ColorPicker from "./ColorPicker";
import { EDITORS } from "../scripts/constants";
import * as utils from "../scripts/utils"
import { ConfigPath } from "../scripts/utils";
import * as React from 'react'

const editorMapping = {
  [EDITORS.input]: InputEditor,
  [EDITORS.richText]: RichText,
  [EDITORS.select]: SelectEditor,
  [EDITORS.uploader]: ImageEditor,
  [EDITORS.position]: PositionEditor,
  [EDITORS.colorPicker]: ColorPicker
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

function useDebounceEffect(func: Function, deps: any[], debounceMs: number=300){
  const timerRef = React.useRef<any>(null)
  useEffect(() => {
    if(timerRef.current){
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(func, debounceMs)
  }, deps)
}

function ConfigPanel(props: {updateFn: any, component: Component, currentEditor: Record<string, any>}) {
  const { updateFn, component, currentEditor } = props;
  const componentProps = component.props
  const [form] = useForm();

  const onReset = () => {
    form.resetFields()
  }

  const outsizeProps = [
      component.props.style.width, 
      component.props.style.height,
      component.props.drag?.position?.[0],
      component.props.drag?.position?.[1]
    ]

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(componentProps)
  }, [component.id])

  useDebounceEffect(() => {
    form.resetFields()
    form.setFieldsValue(componentProps)
  }, outsizeProps)

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
      onValuesChange={(e) => {
        if(e.url){
          const img = new Image();
          img.src = e.url;
          img.onload = function(e: any){
            const height = e.path[0].naturalHeight;
            const width = e.path[0].naturalWidth;
            const ratio = (width / height).toString();
            localStorage.setItem(component.id, ratio);
          };
        }
        if(e.drag?.position){
          form.submit()
        }else{
          submit()
        }
      }}    
    >
      {
        configItems
      }
    </Form>
  );
}

export default ConfigPanel;
