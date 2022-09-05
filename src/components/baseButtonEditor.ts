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
        width: '150px',
        height: '50px'
    }
}

export default baseButtonEditor;