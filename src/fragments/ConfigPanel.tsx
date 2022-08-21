import { Button, Form, Input, Row } from "antd";
import { useForm } from "antd/lib/form/Form";

function ConfigPanel(editableConfig: any,updateFn: (newConfig: {}) => void) {
  const keys = Object.keys(editableConfig);

  const [form] = useForm(); 

  const onFinish = () => {
     form.validateFields().then((value) => {
        debugger
       updateFn(value);
     });
   };

  return (
    <Form name="config-panel" form={form} onFinish={onFinish}>
      {keys.map((item) => (
        <Form.Item initialValue={editableConfig[item]} label={item} key={item} name={item}>
          <Input />
        </Form.Item>
      ))}
      <Row justify="center" align="middle">
        <Form.Item>
          <Button>取消</Button>
        </Form.Item>
        <Form.Item>
          <Button style={{ margin: "0 4px" }}>还原</Button>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">保存</Button>
        </Form.Item>
      </Row>
    </Form>
  );
}

export default ConfigPanel;
