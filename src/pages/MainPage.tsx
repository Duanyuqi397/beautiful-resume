import { Row, Col, Button, Input } from "antd";
import "./MainPage.css";
import importComponents from "../scripts/importComponents";
import { Component } from '../core/types'
import ConfigPanel from "../fragments/ConfigPanel"
import React, {
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";


import AuxiliaryLine from "../fragments/AuxiliaryLine";
import CandidatePanel from "../fragments/CandidatePanel"
import { adjustImage }  from "../scripts/utils";
import edit from "../assets/others/edit.svg";
import dictionary from "../assets/others/dictionary.svg";
import config from "../assets/others/config.svg";
import exportPDF from "../scripts/exportPDF";
import { 
  useApp, 
  useActives, 
  useRoot, 
  useKeyboardEvent, 
  useCopyPasteEvent 
} from '../core/hooks'
import { useRender } from '../core/hooks/renderHook'

//引入components下的组件
const renders = importComponents(
  require.context("../components/", false, /[^.]+\.tsx/)
)


export const MainPage = () => {
  const { add, remove } = useApp()
  const { actives } = useActives()
  const { root } = useRoot()
  const render = useRender(renders)
  const [container, setContainer] = useState<HTMLElement>()

  useEffect(() => {
    const htmlId = root.props.id
    if(document.getElementById(htmlId)){
      setContainer(document.getElementById(htmlId) as HTMLElement)
    }
  })

  const [title,setTitle] = useState("我的简历")

  useKeyboardEvent(e => {
      const target = e.target as HTMLElement;
      if (
        target.contentEditable === "true" ||
        target.nodeName === "INPUT" ||
        actives.length < 1
      ) {
        return;
      }
      remove(actives.map(c => c.id))
    }
  , "Backspace")

  useCopyPasteEvent('paste', (e) => {
    if (!e.clipboardData?.items) return;
    const data = e.clipboardData.items;
    const imgData = Array.from(data).find(
      (item) => item.type === "image/png"
    );

    const componentInfo = Array.from(data).find(
      (item) => item.type === "text/plain"
    )
    
    componentInfo?.getAsString((componentStr) => {
      const component = JSON.parse(componentStr) as Component;
      const [x, y] = component.props.position;
      component.props.position = [x + 10, y + 10];
      add({...component, id: undefined}) // remove 
    })
    const imgInfo = imgData?.getAsFile();
    if (imgInfo) {
      const url = URL.createObjectURL(imgInfo);
      const imageRender = renders.get("BaseImg") as any
      if(imageRender.defaultProps){
        const [componentWidth] = imageRender.defaultProps.size;
        adjustImage(url, componentWidth).then(
          (data) => {
            add({
              type: "BaseImg",
              props: {
                size: [data.componentWidth, data.realHeight],
                position: [10, 10],
                keepRatio: true,
                style: {
                  position: 'absolute'
                },
                url
              }
            })
          }
        )
      }
    }
  })

  useCopyPasteEvent('copy', e => {
    if(actives.length !== 1){
      return;
    }
    const activeComponent = actives[0]
    e.clipboardData?.setData('text/plain', JSON.stringify(activeComponent));
    e.preventDefault();
  })

  function onExportPDF(){
    container && exportPDF(title, container);
  }

  return (
    <div>
      <div className="header">
          <div className="header-title">
            <img src={edit} alt="" />
            <Input placeholder="输入你的简历名字" 
              className="input-header" 
              onBlur={e => setTitle(e.target.value)}
              // onPressEnter={e => setTitle(e.target)}
            />
          </div>
        <Button onClick={onExportPDF}>导出PDF</Button>
      </div>
      <div>
        <Row>
          <Col span={4}>
            <div className="component-lib block">
              <div className="component-lib-title">
                <img src={dictionary} alt="" />
                基础组件
              </div>
              <div className="component-list">
                {
                  container ? (
                    <CandidatePanel 
                      targetDom={container} 
                      renders={renders} 
                    />
                  ): null
                }
              </div>
            </div>
          </Col>
          {/* 预览区域 */}
          <Col span={16}>
            <div className="view-area block">{render()}</div>
          </Col>
          <Col span={4}>
            <div className="config-panel block">
              <div className="config-panel-title">
                <img src={config} alt="" />
                属性配置
              </div>
              <div className="config">
                <ConfigPanel/>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <AuxiliaryLine container={container}/>  
    </div>
  );
};
