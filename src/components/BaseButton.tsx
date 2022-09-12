import { Button } from "antd";
import { Cprops } from "../types/types";

const BaseButton: React.FC<Cprops> = (props: Cprops) => {
    return (
        <Button {...props}>Button</Button>
    )
}

BaseButton.defaultProps = {
    style: {
        width: 100,
        height: 50
    }
}

export default BaseButton;