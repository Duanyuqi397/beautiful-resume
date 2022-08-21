const rootEditor = {
    name:'rootEditor',
    component: 'div',
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
        backgroundColor: 'black',
        color: 'white'
    }
}

export default rootEditor;