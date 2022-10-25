import { Children, cloneElement } from 'react'
import { Position } from '../core/types'
import { useDrag } from '../core/hooks'
import { getDragStyle } from '../core/box/styleUtils'

type DraggableProps = {
    onDrag: (p: Position) => void,
    onDragEnd: (p: Position) => void
    position: Position,
    children: React.ReactElement
}

const Draggable: React.FC<DraggableProps> = (props) => {
    const {
        position,
        onDrag,
        onDragEnd
    } = props
    
    const [start, stop] = useDrag(
        positions => onDrag(positions[0]), 
        positions => onDragEnd(positions[0])
    )

    const wrapperedChildren = cloneElement(
        Children.only(props.children) as React.ReactElement,
        {
            onMouseDown: (e: MouseEvent) => start([position], e), 
            onMouseUp: stop,
            style: { 
                ...getDragStyle(position),
                cursor: "move"
            }
        }
    )
    return wrapperedChildren
}

export default Draggable;