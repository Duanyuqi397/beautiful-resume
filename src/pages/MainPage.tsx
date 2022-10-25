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
import { useApp, useActives, useKeyboardEvent, useCopyPasteEvent } from '../core/hooks'
import { useRender } from '../core/hooks/renderHook'

//引入components下的组件
const renders = importComponents(
  require.context("../components/", false, /[^.]+\.tsx/)
);



const defaultRoot: Component = {
  type: "div",
  id: "root-container",
  props: {
    id: "root-container",
    position: [0, 0],
    size: [842, 595],
    style: {
      backgroundColor: "white",
      position: "relative",
      margin: "auto",
    },
  },
  children: [],
  parent: '',
  canActive: false,
  canDrag: false
}


export const MainPage = () => {
  const {components, add, remove} = useApp()
  const { actives } = useActives()
  const render = useRender(renders)
  const containerRef = useRef<HTMLElement>()
  const [_, setRootRendered] = useState<boolean>(false)

  useEffect(() => {
    add(defaultRoot)
  }, [])

  useEffect(() => {
    if(!containerRef.current){
      containerRef.current = document.getElementById("root-container") as HTMLElement
      if(containerRef.current){
        setRootRendered(true)
      }
    }
  })

  function renderAll(){
    const root = components.filter(c => c.id === defaultRoot.id)
    if(root.length > 0){
      return render(root[0])
    }
    return undefined
  }

  const [title,setTitle] = useState("我的简历")

  useKeyboardEvent(e => {
    if (e.code === "Backspace") {
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
  })

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
      add({...component, id: undefined})
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
              children: [],
              parent: "root-container",
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
    containerRef.current && exportPDF(title,containerRef.current);
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
                  containerRef.current ? (
                    <CandidatePanel 
                      targetDom={containerRef.current} 
                      renders={renders} 
                    />
                  ): null
                }
              </div>
            </div>
          </Col>
          {/* 预览区域 */}
          <Col span={16}>
            <div className="view-area block">{renderAll()}</div>
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
      <AuxiliaryLine container={containerRef.current}/>  
    </div>
  );
};
