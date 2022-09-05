import { Row, Col } from "antd";
import "./MainPage.css";
import importComponents from "../scripts/importComponents";
import { Component } from "../types/types";
import { RenderEngine } from "../fragments/renderEngine";
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
import { configEngine } from "../fragments/configEngine";
import importConfigs from "../scripts/importConfigs";
import importIcons from "../scripts/importIcons";
import AuxiliaryLine from "../fragments/AuxiliaryLine";
import useAlign from "../fragments/alignHook";
import * as utils from "../scripts/utils";
import edit from "../assets/others/edit.svg";
import dictionary from "../assets/others/dictionary.svg";
import config from "../assets/others/config.svg";

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

const mapNames: Record<string, string> = {
  BaseAvatar: "头像",
  BaseButton: "按钮",
  BaseUnorderedList: "无序列表",
  BaseOrderedList: "有序列表",
  BaseDivider: "分割线",
  BaseLink: "链接",
  BaseInput: "输入框",
  BaseImg: "图片",
  BaseTextArea: "文本编辑",
};

const render = new RenderEngine(components);

const defaultRoot: Omit<Component, "id" | "children"> = {
  type: "div",
  props: {
    id: "root-container",
    style: {
      backgroundColor: "white",
      position: "relative",
      height: "842px",
      width: "595px",
      margin: "auto",
    },
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
  const operation = configEngine(configs);
  const [activeId, setActiveId] = useState<string>("");
  const position = useMap<number, [number, number]>(new Map());
  const containerRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<Map<number, HTMLElement | null>>(new Map());
  const align = useAlign([0, 595, 0, 842]);
  const [elements, op] = useComponents(defaultRoot, {
    common: {
      onMouseDown: useEvent((id, e) => {}),

      onMouseUp: useEvent((id, e) => {}),

      onClick: useEvent((id, e) => {
        setActiveId(id);
      }),

      onPositionChange: useEvent((id, position) => {
        op.mergePropsTo("drag", id, { position: position as any });
        const component = op.find(id);

        const left = (component.props.style?.left || 0) as number;
        const top = (component.props.style?.top || 0) as number;

        const size = {
          width: component.props.style.width,
          height: component.props.style.height,
        };

        const [transateX, tarnsateY] = position as any;

        const absLeft = left + transateX;
        const absTop = top + tarnsateY;
        const absRight = absLeft + utils.parseNumberFromStyle(size.width);
        const absBottom = absTop + utils.parseNumberFromStyle(size.height);

        align.calAlign(id, [absLeft, absRight, absTop, absBottom]);
      }),

      onSizeChange: useEvent((id, size) => {
        op.mergePropsTo("style", id, size as any);
      }),

      onDragEnd: useEvent((id, position) => {
        align.resetAlign();
      }),

      onResizeEnd: useEvent((id, size) => {
        align.resetAlign();
      }),
    },
  });

  useEffect(() => {
    function deleteComponent(e: KeyboardEvent){
      const target = e.target as HTMLElement
      if(e.code === 'Backspace' && target.nodeName === "BODY"){
        if(activeId){
          op.remove(activeId)
          align.removeAlign(activeId)
        }
      }}
    document.addEventListener("keydown", deleteComponent);
    return () => document.removeEventListener("keydown", deleteComponent);
  }, [op, activeId]);

  useEffect(() => {
    const container = document.getElementById("root-container");
    containerRef.current = container;
  }, []);

  function addComponent(type: string, left: number, top: number) {
    const component = op.add(type, {
      style: {left: 0, top: 0, position: "absolute", width: 0, height: 0},
      drag: {
        // bound: 'parent',
        canResize: true,
        canDrag: true,
        position: [left, top],
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
      const currentConfig = (operation.initConfig(newComponent)) as Component;
      setActiveId(newComponent.id);
      const width = utils.parseNumberFromStyle(currentConfig.props.style.width)
      const height = utils.parseNumberFromStyle(currentConfig.props.style.height)
      align.setPosition(newComponent.id, [gridLeft, gridLeft + width, gridTop, gridTop + height])
    }
    position.set(index, [0, 0]);
  }

  return (
    <div>
      {align.hasAlign() ? <AuxiliaryLine lines={align.alignPositions} /> : null}
      <div className="header">
        <img src={edit} alt="" />
        编辑自定义组件
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
                {Object.keys(components).map((item, index) => {
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
                        <img
                          src={icons[mapNames[item]]}
                          alt=""
                          draggable={false}
                        />
                        {mapNames[item]}
                      </div>
                    </Draggable>
                  );
                })}
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div className="view-area block">{render.render(op.getMap())}</div>
          </Col>
          <Col span={4}>
            <div className="config-panel block">
              <div className="config-panel-title">
                <img src={config} alt="" />
                属性配置
              </div>
              <div className="config">
                {activeId && (
                  <ConfigPanel
                    currentEditor={operation.getEditor(op.find(activeId).type)}
                    componentProps={op.find(activeId).props}
                    updateFn={(newProps: any) => op.mergeProps(activeId, newProps)}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
