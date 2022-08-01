import { Input } from "antd";
import { Cprops } from "../types/types";

const BaseInput: React.FC<Cprops> = (props: Cprops) => {
    return <Input {...props} />
}

export default BaseInput;