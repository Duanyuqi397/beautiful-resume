import { Button, Row, Col } from "antd";
import "./MainPage.css";

// import { components } from "../components";

const stacks = ["BaseButton", "BaseInput", "BaseContainer"];

const cache = [];
function importAll(r:any) {
  r.keys().forEach((key:any) => (cache[key] = r(key)));
  }
  
const components = importAll(require.context('../components/', false, /[^.]+\.tsx/));
  
export const MainPage = () => {
  console.log(components);
  return (
    <>
      <div>Header</div>
      <div>
        <Row>
          <Col span={4}>
            <div className="component-lib block">
              <div className="component-lib-title">组件库</div>
              <ul>
                {stacks.map((item, index) => {
                  return <li>{item}</li>;
                })}
              </ul>
            </div>
          </Col>
          <Col span={16}>
            <div className="view-area block">
              <div className="view-area-title">预览区域</div>
              {/* {components.map((item:any,index:any) => {
                return <li key={index}>
                    {item}
                </li>
              })} */}
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
