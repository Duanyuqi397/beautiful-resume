import { Input } from "antd";
import { useState } from "react";
import { Cprops } from "../types/types";

const BaseUnorderedList: React.FC<Cprops> = (props:Cprops) => {
    const [list,setList] = useState<String[]>(['123']);
    const [content,setContent] = useState('');
    return (
        <div {...props}>
            <ul style={{textAlign:'left'}}> 
            {
                list.map((item,index) => {
                    return <li style={{listStyle:'inside'}}>
                        {item}
                        <Input />
                    </li>
                })
            }
        </ul>
        </div>
    )
}

export default BaseUnorderedList;