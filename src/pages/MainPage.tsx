import { Row, Col } from "antd";
import "./MainPage.css";
import importComponents from "../scripts/importComponents";

//引入components下的组件
const components:Record<string,any> = importComponents(
  require.context("../components/", false, /[^.]+\.tsx/)
);

export const MainPage = () => {
  return (
    <>
      <div>Header</div>
      <div>
        <Row>
          <Col span={4}>
            <div className="component-lib block">
              <div className="component-lib-title">组件库</div>
              <ul>
                {Object.keys(components).map((item, index) => {
                  return <li className="component-item" draggable={true} onDrag={onDrag}  key={index}>{item}</li>;
                })}
              </ul>
            </div>
          </Col>
          <Col span={16}>
            <div className="view-area block">
              <div className="view-area-title">预览区域</div>
              {Object.values(components)?.map((Component:any,index:any) => (
                <li key={index}>
                    <Component />
                </li>
              ))}
            </div>
          </Col>
          <Col span={4}>
            <div className="config-panel block">
              <div className="config-panel-title">属性配置</div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

const onDrag = () => {

}
