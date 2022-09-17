const mapNames: Record<string,string> = {
    "BaseAvatar": "头像",
    "BaseButton": "按钮",
    "BaseUnorderedList": "无序列表",
    "BaseOrderedList": "有序列表",
    "BaseDivider": "分割线",
    "BaseLink": "链接",
    "BaseInput": "输入框",
    "BaseImg": "图片",
    "BaseTextArea": "文本编辑",
    "BaseContainer": "容器"
};

const importIcons = (req: any): Record<string, string> => {  
    const entries = req.keys().map((key: any) => [req(key).substring(14,req(key).indexOf('.')),req(key)]);
    let objectEntries = Object.fromEntries(entries);
    let obj = new Map<string,string>(); 
    for (const key in objectEntries) {
        obj.set(mapNames[key],objectEntries[key]);
    }
    return Object.fromEntries(obj);
}

export default importIcons;