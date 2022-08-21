const baseImgEditor = {
    name:'baseImgEditor',
    component: 'BaseImg',
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
        width: '40px',
        height: '40px'
    }
}

export default baseImgEditor;