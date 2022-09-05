import { Button, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import { Cprops } from "../types/types";
import { getEditableProps, mergeProps } from "./configEngine";

function ConfigPanel(props: {updateFn: any, componentProps: Cprops, currentEditor: Record<string, any>}) {
  const { updateFn, componentProps, currentEditor } = props;
  const editableConfig = getEditableProps(componentProps,{...currentEditor.style});
  const keys = Object.keys(editableConfig);
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue(editableConfig);
  },[componentProps])

  const onFinish = () => {
    form.validateFields().then((value) => {
      updateFn(mergeProps(componentProps,value));
    });
  };

  const onReset = () => {
    form.resetFields()
  }

  return (
    <Form name="config-panel" form={form} onFinish={onFinish}>
      {keys.map((item) => (
        <Form.Item
          initialValue={editableConfig[item]}
          label={item}
          key={item}
          name={item}
          rules={[{ required: true, message: 'It is cannot be null!' }]}
        >
          <Input />
        </Form.Item>
      ))}
      {keys.length !== 0 && (
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
      )}
    </Form>
  );
}

export default ConfigPanel;
