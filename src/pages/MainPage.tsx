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

const render = new RenderEngine(components)

const defaultRoot: Omit<Component, "id" | "children"> = {
  type: "div",
  props: {
    id: "root-container",
    style: { backgroundColor: "white", position: "relative", height: "842px",width: "595px",margin: 'auto' },
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
  const position = useMap<number, [number, number]>(new Map());
  const containerRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<Map<number, HTMLElement | null>>(new Map());
  const [elements, op] = useComponents(defaultRoot, {
    common: {
        onMouseDown: useEvent((id, e) => {}),

        onMouseUp: useEvent((id, e) => {}),

        onPositionChange: useEvent((id, position) => {
            op.mergePropsTo('drag', id, {position: position as any})
        }),

        onSizeChange: useEvent((id, size) => {
            op.mergePropsTo('drag', id, {size: size as any})
        })
      }
    }
  )

  useEffect(() => {
    const container = document.getElementById("root-container")
    containerRef.current = container
  }, [])

  function addComponent(type: string, left: number, top: number) {
    return op.add(type, {
      style: { left, top, position: "absolute" },
      drag: {
        bound: 'parent',
        canResize: true,
        canDrag: true,
        position: [0, 0],
        size: { width: 0, height: 0 },
        disableArea: 10
      }
    })
  }

  function onDragEnd(index: number, type: string) {
    const element = nameRef.current.get(index) || null;
    if (element === null || containerRef.current === null) {
      return;
    }
    const containByContainer = contains(containerRef.current, element);
    if (containByContainer) {
      const [left, top] = offsetSet(containerRef.current, element);
      const newComponent = addComponent(type, left, top);
      const currentConfig = operation.addConfig(newComponent);
    }
    position.set(index, [0, 0]);
  }

  return (
    <div>
      <div className="header">编辑自定义组件</div>
      <div>
        <Row>
          <Col span={4}>
            <div className="component-lib block">
                <div className="component-lib-title">基础组件</div>
              <div className="component-list">
                {Object.keys(icons).map((item,index) => {
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
                          <img src={icons[item]}/>
                          {item}
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
