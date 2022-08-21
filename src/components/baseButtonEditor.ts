const baseButtonEditor = {
    name:'baseButtonEditor',
    component: 'BaseButton',
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
        width: '400px',
        height: '400px'
    }
}

export default baseButtonEditor;