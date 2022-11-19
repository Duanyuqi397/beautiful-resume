import useDrag from '../hooks/dragHook'
import useResize from '../hooks/resizeHook'
import { useApp, useActives } from '../hooks/appHook'
import { Component } from '../types'
import * as React from 'react'
import { getDragStyle } from './styleUtils'
import ResizeBar from './ResizeBar'
import { splitByKeys } from '../utils'

const BoxComponent: React.FC<Component & {inner: React.ReactElement}> =  (component) => {
    const {actives, activeIds} = useActives()
    const { batchMerge, merge, setState } = useApp()
    const domRef = React.useRef<HTMLElement>()
    const {
        id: componentId,
        props,
        canDrag,
        canResize,
        inner,
    } = component
    const [startDrag, inDrag] = useDrag(
        positions => {
            if(activeIds.length > 1){
                const newPositions = activeIds.map((componentId, index) => [componentId, {position: positions[index]}] as const)
                batchMerge(newPositions)
                setState(activeIds, "drag")
            }else{
                merge(componentId, {position: positions[0]})
                setState([componentId], "drag")
            }
        },

        positions => {
            if(activeIds.length > 1){
                setState(activeIds, undefined)
            }else{
                setState([componentId], undefined)
            }
        }

    )

    const [startResize, inResize] = useResize(
        posAndSize => {
            merge(componentId, posAndSize)
            setState([componentId], "drag")
        },
        () => {
            setState([componentId], undefined)
        },
        props.keepRatio
    )

    function handleMouseDown(e: MouseEvent){
        if(canDrag !== false){
            const positions = actives.map(c => c.props.position)
            if(positions.length > 1){
                startDrag(positions, e)
            }else{
                startDrag([props.position], e)
            }
        }
        props.onMouseDown && props.onMouseDown(e)
    }


    function handleMouseUp(e: any){
        props.onMouseUp && props.onMouseUp(e)
    }

    function handleClick(e: MouseEvent){
        domRef.current = e.currentTarget as HTMLElement
        props.onClick && props.onClick(e)
    }

    function getAllowDirection(){
        if(actives.length > 1){
            return []
        }
        return undefined
    }

    let resizeBar: React.ReactNode = null
    const dom = domRef.current as HTMLElement
    if(activeIds.includes(props.id) && dom && (!inDrag())){
        resizeBar = (
            <ResizeBar 
                target={dom}
                key={2}
                allowDirections={getAllowDirection()}
                onResizeStart={(e, direction) => startResize(props, e, direction)}
            />
        )
    }
    const [
        htmlProps,
        {
            size,
            position,
            layer
        }
    ] = splitByKeys(props, ['size', 'position', 'layer', 'canDrag', 'canResize', 'keepRatio'])
    const wrapperedChildren = React.cloneElement(
        inner as React.ReactElement,
        {
            ...htmlProps,
            onMouseDown: handleMouseDown, 
            onMouseUp: handleMouseUp,
            onClick: handleClick,
            style: {
                ...htmlProps.style, 
                ...getDragStyle(position),
                cursor: component.canDrag === false ? "" : "move",
                width: size[0],
                height: size[1],
                zIndex: layer
            },
            key: component.id
        }
    )

    return (
        <>
            {wrapperedChildren}
            {resizeBar}
        </>
    )

}

export default BoxComponent