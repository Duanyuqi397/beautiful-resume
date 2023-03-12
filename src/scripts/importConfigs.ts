import baseImgEditor from "../components/baseImgEditor";
import baseTextAreaEditor from "../components/baseTextAreaEditor";
import baseContainerEditor from "../components/baseContainerEditor";
import baseDividerEditor from "../components/baseDividerEditor";

const importConfigs = (req: any): Record<string, Object> => {  
    // const map = new Map<string, any>();
    // map.set('baseImgEditor', baseImgEditor);
    // map.set('baseTextAreaEditor', baseTextAreaEditor);
    // map.set('baseContainerEditor', baseContainerEditor);
    // map.set('baseDividerEditor', baseDividerEditor);
    return {
        baseImgEditor,
        baseTextAreaEditor,
        baseContainerEditor,
        baseDividerEditor
    }
}
export default importConfigs;