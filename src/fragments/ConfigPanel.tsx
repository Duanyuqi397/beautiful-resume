import { Button, Divider, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import RichText from "./RichText";
import InputEditor from "./InputEditor";
import SelectEditor from "./SelectEditor";
import ImageEditor from "./ImageEditor";
import PositionEditor from "./PositionEditor";
import ColorPicker from "./ColorPicker";
import { EDITORS } from "../scripts/constants";
import * as utils from "../core/utils";
import { ConfigPath } from "../scripts/utils";
import * as React from "react";
import importConfigs from "../scripts/importConfigs";
import { useActives, useApp } from "../core/hooks"
//引入配置文件
const configs: Record<string, any> = importConfigs(
  require.context("../components/", false, /[^.]+\.ts$/)
);

const editorMapping = {
  [EDITORS.input]: InputEditor,
  [EDITORS.richText]: RichText,
  [EDITORS.select]: SelectEditor,
  [EDITORS.uploader]: ImageEditor,
  [EDITORS.position]: PositionEditor,
  [EDITORS.colorPicker]: ColorPicker,
};

function getEachItem(item: ConfigPath) {
  return (
    <Form.Item
      shouldUpdate={(prevValues, curValues) => prevValues !== curValues}
      label={item.config.name} 
      key={item.path.join("-")}
      name={item.path}
      rules={item.config.validateRules}
      initialValue={item.config.defaultValue}
    >
      {React.createElement(
        editorMapping[item.config.type] as any,
        item.config.otherProps
      )}
    </Form.Item>
  );
}

function flatConfigs(configs: [string, ConfigPath[]]) {
  const [groupName, items] = configs;
  const components = items.map(getEachItem);
  const line = (
    <Divider
      key={groupName}
      plain
      style={{ color: "#999494", fontWeight: "lighter" }}
    >
      {groupName}
    </Divider>
  );
  return [line, ...components];
}
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16, offset: 1 },
};

function ConfigPanel() {
  const { actives } = useActives()
  const { merge } = useApp()
  const [form] = useForm()
  const activeComponent = actives.length === 1 ? actives[0] : null
  const componentProps = activeComponent?.props

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(componentProps);
  }, [activeComponent?.id]);

  if(!componentProps){
    return <></>
  }
  
  
  const currentEditor = Object.values(configs).find(item => item.component === activeComponent.type)
  if(!currentEditor){
    throw new Error(`no editor config found for ${activeComponent.type}`)
  }
  // useDebounceEffect(() => {
  //   form.resetFields();
  //   form.setFieldsValue(componentProps);
  // }, outsizeProps);

  const submit = utils.debounce(form.submit, 300);

  const flaternConfigs = utils.flatConfigs(currentEditor.config);
  const groupedConfigs = Object.entries(
    utils.groupBy(flaternConfigs, (configPath) => configPath.config.group ?? "")
  );
  const configItems = groupedConfigs.map(flatConfigs);

  return (
    <Form
      {...formItemLayout}
      name="config-panel"
      form={form}
      initialValues={componentProps}
      onFinish={(values) => merge(activeComponent.id, values)}
      onFinishFailed={(err) => console.info("validate error", err)}
      onValuesChange={(e) => {
        if (e.url) {
          const url = e.url;
          const [initWidht] = componentProps.size
          utils
            .adjustImage(e.url, initWidht)
            .then((data) => {
              merge(
                activeComponent.id,
                {
                  size: [data.componentWidth, data.realHeight],
                  url
                }
              )
            });
          return;
        }
        submit()
      }}
    >
      {configItems}
    </Form>
  );
}

export default ConfigPanel;
