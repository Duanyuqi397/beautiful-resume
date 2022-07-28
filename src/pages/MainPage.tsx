import { Row, Col } from "antd";
import "./MainPage.css";
import importComponents from "../scripts/importComponents";
import { Component } from "../types/types";
import renderEngine from "../fragments/renderEngine";

//引入components下的组件
const components:Record<string,any> = importComponents(
  require.context("../components/", false, /[^.]+\.tsx/)
);

const myDiv:Component[] = [{
  id:'div',
  type: 'button',
  props: {style:{backgroundColor: 'pink',width:'100px',height:'100px',position:'absolute',top: '500px'}},
  children: ['div1']
},{
  id:'div1',
  type: 'text',
  props: {value: "textButton"},
  children: []
}]

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
                {Object.keys(components).map((item, index) => {
                  return <li className="component-item" draggable={true} onDrag={onDrag} onDragEnd={onDropOver}  key={index}>{item}</li>;
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
              {renderEngine(myDiv)}
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

const onDropOver = () => {
  console.log(11111);
}
