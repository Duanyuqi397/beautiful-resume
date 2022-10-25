
import importIcons from "../scripts/importIcons";
import Draggable  from './Draggable'
import { useState, useRef } from 'react'
import { Position, Cprops } from '../core/types'
import { useApp } from '../core/hooks'
import { merge } from '../core/utils'
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
  BaseContainer: "容器",
};

type CandidatePanelProps = {
  renders: Map<string, React.FC<any>>,
  targetDom: HTMLElement,
}

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



function CandidatePanel(props: CandidatePanelProps){
  const [positions, setPositions] = useState<{[args: string]: Position}>({})
  const refs = useRef<Map<string, HTMLElement | null>>(new Map());
  const {
    targetDom,
    renders
  } = props
  const renderNames = Array.from(renders.keys())
  const { add, activite } = useApp()

  function addComponent(type: string, left: number, top: number) {
    const initProps: Cprops = {
      style: { left: 0, top: 0, position: "absolute"},
      position: [left, top],
      size: [0, 0]
    }
    const render = renders.get(type)
    if (!render) {
      throw new Error("can find render with type: " + type)
    }
    const props = merge(initProps, render.defaultProps ?? {})
    const component = add({props, type})
    activite([component.id])
    return component;
  }

  function onDragEnd(componentName: string){
    const element = refs.current.get(componentName)
    if(!element){
      return
    }
    const containByContainer = contains(targetDom, element)
    if (containByContainer) {
      const [left, top] = offsetSet(targetDom, element)
      const gridLeft = Math.floor(left)
      const gridTop = Math.floor(top)
      addComponent(componentName, gridLeft, gridTop)
    }
    setPositions({...positions, [componentName]: [0, 0]})
  }
    return <>
      {
        renderNames.map(name => {
          const position = positions[name] ?? [0, 0]
          return (
            <Draggable
              position={position}
              onDrag={position => setPositions({...positions, [name]: position})}
              onDragEnd={position => onDragEnd(name)}
              key={name}
            >
              <div
                ref={(r) => refs.current.set(name, r)}
                className="component-item"
                key={name}
              >
                <img
                  src={icons[mapNames[name]]}
                  alt=""
                  draggable={false}
                />
                {mapNames[name]}
              </div>
            </Draggable>
          );
        })
      }
    </>
}

export default CandidatePanel