import { Row, Col } from "antd";
import "./MainPage.css";
import importComponents from "../scripts/importComponents";
import { Component } from "../types/types";
import renderEngine, { RenderEngine } from "../fragments/renderEngine";
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

//引入components下的组件
const components: Record<string, any> = importComponents(
  require.context("../components/", false, /[^.]+\.tsx/)
);

const render = new RenderEngine(components)

function useEvent(callback: (id: string, event: SyntheticEvent) => void) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return (id: string, event: SyntheticEvent) => {
    callbackRef.current(id, event);
  };
}

const defaultRoot: Omit<Component, "id" | "children"> = {
  type: "div",
  props: {
    id: "root-container",
    style: { backgroundColor: "pink", position: "relative", height: "842px",width: "595px",margin: 'auto' },
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
  const position = useMap<number, [number, number]>(new Map());
  const containerRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<Map<number, HTMLElement | null>>(new Map());
  const [elements, op] = useComponents(defaultRoot, {
    common: {
      onMouseDown: useEvent((id, e) => {}),

      onMouseUp: useEvent((id, e) => {}),

      onDrag: useEvent((id, position) => {
        op.mergePropsTo("drag", id, { position: position as any });
      }),
    },
  });

  useEffect(() => {
    const container = document.getElementById("root-container");
    containerRef.current = container;
  }, []);

  function addComponent(type: string, left: number, top: number):Component {
    return op.add(type, {
      style: { left, top, position: "absolute" },
      drag: {
        bound: "parent",
        canDrag: true,
        position: [0, 0],
        disableArea: 10,
      },
    });
  }

  function onDragEnd(index: number, type: string) {
    const element = nameRef.current.get(index) || null;
    if (element === null || containerRef.current === null) {
      return;
    }
    const containByContainer = contains(containerRef.current, element);
    if (containByContainer) {
      const [left, top] = offsetSet(containerRef.current, element);
      const config = addComponent(type, left, top);
      debugger
    }
    position.set(index, [0, 0]);
  }

  return (
    <>
      <div>Header</div>
      <div>
        <Row>
          <Col span={4}>
            <div className="component-lib block">
              <Draggable>
                <div className="component-lib-title">组件库</div>
              </Draggable>
              <ul>
                {Object.keys(components).map((item, index) => {
                  return (
                    <Draggable
                      position={position.get(index) || [0, 0]}
                      onDrag={([x, y]) => position.set(index, [x, y])}
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
                        style={{cursor: 'pointer'}}
                        //onClick = {() => addComponent(item)}
                      >
                        {item}
                      </li>
                    </Draggable>
                  );
                })}
              </ul>
            </div>
          </Col>
          <Col span={16}>
            <div className="view-area block">
              <div className="view-area-title">预览区域</div>
              {/* {Object.values(components)?.map((Component:any,index:any) => (
                <li key={index}>
                    <Component />
                </li>
              ))} */}
              {render.render(op.getMap())}
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

const onDrag = () => {};

const onDropOver = () => {
  console.log(11111);
};
