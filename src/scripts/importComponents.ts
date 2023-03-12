import BaseImg from "../components/BaseImg";
import BaseTextArea from "../components/BaseTextArea";
import BaseContainer from "../components/BaseContainer";
import BaseDivider from "../components/BaseDivider";

const importComponents = (req: any): Map<string, React.FC<any>> => {
    // const entries = req.keys().map((key: any) => [req(key).default.name,req(key).default as React.FC<any>]);
    // return new Map(entries);
    const map = new Map<string, any>();
    map.set('BaseImg', BaseImg);
    map.set('BaseTextArea', BaseTextArea);
    map.set('BaseContainer', BaseContainer);
    map.set('BaseDivider', BaseDivider);
    return map;
}

export default importComponents;