import BaseContainer from '../assets/BaseContainer.svg'
import BaseDivider from '../assets/BaseDivider.svg'
import BaseTextArea from '../assets/BaseTextArea.svg'
import BaseImg from '../assets/BaseImg.svg'

// const mapNames: Record<string,string> = {
//     "BaseAvatar": "头像",
//     "BaseButton": "按钮",
//     "BaseUnorderedList": "无序列表",
//     "BaseOrderedList": "有序列表",
//     "BaseDivider": "分割线",
//     "BaseLink": "链接",
//     "BaseInput": "输入框",
//     "BaseImg": "图片",
//     "BaseTextArea": "文本编辑",
//     "BaseContainer": "容器"
// };

const importIcons = (req: any): Record<string, string> => {  
    return {
        "图片": BaseImg,
        "文本编辑": BaseTextArea,
        "分割线": BaseDivider,
        "容器": BaseContainer
    }
}

export default importIcons;