import { Row, Col, } from "antd";
import "./MainPage.css";
import importComponents from "../scripts/importComponents";
import { Component } from '../core/types'
import ConfigPanel from "../fragments/ConfigPanel"
import {useState, useEffect} from "react";
import AuxiliaryLine from "../fragments/AuxiliaryLine";
import CandidatePanel from "../fragments/CandidatePanel"
import { adjustImage, getBase64 }  from "../core/utils";
import dictionary from "../assets/others/dictionary.svg";
import config from "../assets/others/config.svg";
import { client } from '../core/network'
import { 
  useApp, 
  useActives, 
  useRoot, 
  useKeyboardEvent, 
  useCopyPasteEvent,
  useSerialize
} from '../core/hooks'
import { useRender } from '../core/hooks/renderHook'
import ToolBar from '../fragments/ToolBar'
import {
  useParams
} from "react-router-dom";
import { useQuery } from '../core/hooks'

//引入components下的组件
const renders = importComponents(
  require.context("../components/", false, /[^.]+\.tsx/)
)


export const MainPage = () => {
  const { add, remove, merge} = useApp()
  const { actives } = useActives()
  const { root } = useRoot()
  const render = useRender(renders)
  const [container, setContainer] = useState<HTMLElement>()
  const { resumeId } = useParams() as any
  const { init } = useSerialize()
  const [
    getResume,
    data
   ] = useQuery(resumeId => client.get(`/components/${resumeId}`))

  useEffect(() => {
   if(resumeId){
    getResume(resumeId)
      .then(data => {
        init(data.components, resumeId)
      })
   }
  }, [resumeId])

  useEffect(() => {
    const htmlId = root.props.id
    if(document.getElementById(htmlId) && !container){
      setContainer(document.getElementById(htmlId) as HTMLElement)
    }
  })

  useKeyboardEvent(e => {
      if(e.code !== "Backspace" && e.code !== "Delete"){
        return
      }
      const target = e.target as HTMLElement;
      if (
        target.contentEditable === "true" ||
        target.nodeName === "INPUT" ||
        actives.length < 1
      ) {
        return;
      }
      remove(actives.map(c => c.id))
    })

  useCopyPasteEvent('paste', async (e) => {
    if (!e.clipboardData?.items) return;
    const data = e.clipboardData.items;
    const imgData = Array.from(data).find(
      (item) => item.type === "image/png"
    )

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
      const imageRender = renders.get("BaseImg") as any
      const url = URL.createObjectURL(imgInfo)
      const [componentWidth] = imageRender.defaultProps.size
      const {realHeight} = await adjustImage(url, componentWidth)
      const {id} =  add({
        type: "BaseImg",
        props: {
          size: [componentWidth, realHeight],
          position: [10, 10],
          keepRatio: true,
          style: {
            position: 'absolute'
          },
          url,
          layer: 0
        }
      })
      const formData = new FormData()
      formData.append("file", imgInfo)
      client.post("/file", formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then((data: any) => {
        console.info("url", data.url)
        merge(id, {remoteURL: data.url})
      })
      .catch(alert)
    }
  })

  useCopyPasteEvent('copy', e => {
    if(actives.length !== 1){
      return;
    }
    if(window.getSelection()?.toString()) return;
    const activeComponent = actives[0]
    e.clipboardData?.setData('text/plain', JSON.stringify(activeComponent));
    e.preventDefault();
  })


  return (
    <div>
      <div className="header">
        <ToolBar container={container}/>
      </div>
      <div>
        <Row align="stretch">
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
