import { Position } from "../types"

function getDragStyle(position: Position){
    const [x, y] = position
    return {
        transform: `translate(${x}px, ${y}px)`,
        transition: "null",
    }
}

export {
    getDragStyle,
}