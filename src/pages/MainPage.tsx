import { Row, Col } from "antd";
import "./MainPage.css";
import importComponents from "../scripts/importComponents";
import { Component, ConfigProps } from "../types/types";
import renderEngine, { RenderEngine } from "../fragments/renderEngine";
import ConfigPanel from "../fragments/ConfigPanel";
import { useComponents, useMap } from "../fragments/dataHook";
import {
  useState,
  useLayoutEffect,
  useRef,
  SyntheticEvent,
  useEffect,
  RefObject,
} from "react";
import Draggable, { Position } from "../fragments/Draggable";
import useEvent from "../fragments/eventHook";
import { useConfig } from "../fragments/configEngine";
import importConfigs from "../scripts/importConfigs";
import importIcons from "../scripts/importIcons";
import AuxiliaryLine from "../fragments/AuxiliaryLine";
import useAlign from "../fragments/alignHook";
import * as utils from "../scripts/utils"

//引入components下的组件
const components: Record<string, any> = importComponents(
  require.context("../components/", false, /[^.]+\.tsx/)
);

//引入配置文件
const configs: Record<string, any> = importConfigs(
  require.context("../components/", false, /[^.]+\.ts$/)
);

//引入icon
const icons: Record<string, any> = importIcons(
  require.context("../assets/", false, /[^.]+\.svg$/)
);

const mapNames: Record<string,string> = {
  "BaseAvatar": "头像",
  "BaseButton": "按钮",
  "BaseUnorderedList": "无序列表",
  "BaseOrderedList": "有序列表",
  "BaseDivider": "分割线",
  "BaseLink": "链接",
  "BaseInput": "输入框",
  "BaseImg": "图片",
  "BaseTextArea": "文本编辑",
};

const render = new RenderEngine(components)

const defaultRoot: Omit<Component, "id" | "children"> = {
  type: "div",
  props: {
    id: "root-container",
    style: { backgroundColor: "white", position: "relative", height: "842px",width: "595px",margin: 'auto'},
  },
};

function contains(container: HTMLElement, element: HTMLElement) {
  const containerBox = container.getBoundingClientRect();
  const elementBox = element.getBoundingClientRect();
  return (
    containerBox.left < elementBox.left &&
    containerBox.right > elementBox.right &&
    containerBox.top < elementBox.top &&
    containerBox.bottom > elementBox.bottom
  );
}

function offsetSet(container: HTMLElement, element: HTMLElement) {
  const containerBox = container.getBoundingClientRect();
  const elementBox = element.getBoundingClientRect();
  return [
    elementBox.left - containerBox.left,
    elementBox.top - containerBox.top,
  ];
}

export const MainPage = () => { 
  console.log(icons);
  console.log(components);
  const [element,operation] = useConfig(configs);
  const [activeId,setActiveId] = useState<string>('');
  const position = useMap<number, [number, number]>(new Map());
  const containerRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<Map<number, HTMLElement | null>>(new Map());
  const align = useAlign([0, 595, 0, 842])
  const [elements, op] = useComponents(defaultRoot, {
    common: {
        onMouseDown: useEvent((id, e) => {}),

        onMouseUp: useEvent((id, e) => {}),

        onClick: useEvent((id,e) => {
          setActiveId(id)
          operation.getConfig(op.find(id))
        }),

        onPositionChange: useEvent((id, position) => {
            op.mergePropsTo('drag', id, {position: position as any})
            const component = op.find(id)
            
            const left = (component.props.style?.left || 0) as number
            const top = (component.props.style?.top || 0) as number

            const size = {width: component.props.style.width, height: component.props.style.height}

            const [transateX, tarnsateY] = position as any
            
            const absLeft = left + transateX
            const absTop = top + tarnsateY
            const absRight = absLeft + utils.parseNumberFromStyle(size.width)
            const absBottom = absTop + utils.parseNumberFromStyle(size.height)

            align.calAlign(id, [absLeft, absRight, absTop, absBottom])
            
        }),

        onSizeChange: useEvent((id, size) => {
            op.mergePropsTo('style', id, size as any)
        }),

        onDragEnd: useEvent((id, position) => {
          align.resetAlign()
        }),

        onResizeEnd: useEvent((id, size) => {
          align.resetAlign()
        })
      }
    }
  )

  useEffect(() => {
    function deleteComponent(e: KeyboardEvent){
      if(e.code === 'Backspace'){
        activeId && op.remove(activeId)
      }
    }
    document.addEventListener('keydown', deleteComponent)
    return () => document.removeEventListener("keydown", deleteComponent)
  }, [op, activeId])

  useEffect(() => {
    const container = document.getElementById("root-container")
    containerRef.current = container
  }, [])

  function addComponent(type: string, left: number, top: number) {
    const component = op.add(type, {
      style: {left, top, position: "absolute", width: 0, height: 0},
      drag: {
        // bound: 'parent',
        canResize: true,
        canDrag: true,
        position: [0, 0],
        disableArea: 10
      }
    })
    return component;
  }

  function onDragEnd(index: number, type: string) {
    const element = nameRef.current.get(index) || null;
    if (element === null || containerRef.current === null) {
      return;
    }

    const containByContainer = contains(containerRef.current, element);
    if (containByContainer) {
      const [left, top] = offsetSet(containerRef.current, element);
      const gridLeft = Math.floor(left)
      const gridTop = Math.floor(top)
      const newComponent = addComponent(type, gridLeft, gridTop);
      const currentConfig = operation.addConfig(newComponent);
      console.info(currentConfig)
      const width = utils.parseNumberFromStyle(currentConfig.props.style.width)
      const height = utils.parseNumberFromStyle(currentConfig.props.style.height)
      align.setPosition(newComponent.id, [gridLeft, gridLeft + width, gridTop, gridTop + height])
    }
    position.set(index, [0, 0]);
  }

  return (
    <div>
      {
        align.hasAlign() ? (
          <AuxiliaryLine
            lines={align.alignPositions}
          />
        ): null
      }
      <div className="header">编辑自定义组件</div>
      <div>
        <Row>
          <Col span={4}>
            <div className="component-lib block">
                <div className="component-lib-title">基础组件</div>
              <div className="component-list">
                {Object.keys(components).map((item,index) => {
                    return (
                      <Draggable
                        position={position.get(index) || [0, 0]}
                        onPositionChange={([x, y]) => position.set(index, [x, y])}
                        onDragEnd={() => onDragEnd(index, item)}
                        key={index}
                        disableArea={10}
                      >
                        <div
                          ref={(r) => nameRef.current.set(index, r)}
                          className="component-item"
                          key={index}
                        >
                          <img draggable="false" src={icons[mapNames[item]]}/>
                          {mapNames[item]}
                        </div>
                      </Draggable>
                    );
                  })}
                {/* {Object.keys(components).map((item, index) => {
                  return (
                    <Draggable
                      position={position.get(index) || [0, 0]}
                      onPositionChange={([x, y]) => position.set(index, [x, y])}
                      onDragEnd={() => onDragEnd(index, item)}
                      key={index}
                      disableArea={10}
                    >
                      <li
                        ref={(r) => nameRef.current.set(index, r)}
                        className="component-item"
                        // draggable={true}
                        // onDrag={onDrag}
                        // onDragEnd={onDropOver}
                        key={index}
                        //onClick = {() => addComponent(item)}
                      >
                        {item}
                      </li>
                    </Draggable>
                  );
                })} */}
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div className="view-area block">
              {/* <div className="view-area-title">预览区域</div> */}
              {render.render(op.getMap())}
            </div>
            
          </Col>
          <Col span={4}>
            <div className="config-panel block">
              <div className="config-panel-title">属性配置</div>
              <div className="config">
                <ConfigPanel {...element} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
