import { Button } from "antd";
import Draggable from "../fragments/Draggable";
import { Cprops } from "../types/types";

const BaseButton: React.FC<Cprops> = (props: Cprops) => {
    return (
        <Button {...props}>Button</Button>
    )
}

const editor = {
    position: {
        x: {
            toEditor: "", 
            toProp: "",
            name: "x",
            type: "number",
            default: 0,
        },
        y: {
            toEditor: "", 
            toProp: "",
            name: "y",
            type: "number",
            default: 0,
        }
    },
    style: {

    }
}

export default BaseButton;