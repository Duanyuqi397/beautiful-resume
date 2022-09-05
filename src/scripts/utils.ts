function parseNumberFromStyle(style: undefined): undefined
function parseNumberFromStyle(style: number|string): number
function parseNumberFromStyle(style: number|string|undefined): undefined|number{
    if(typeof style === 'string' && style.endsWith("px")){
        return parseInt(style.slice(0, -2))
    }else if(typeof style === 'number'){
        return style
    }else if(typeof style === 'undefined'){
        return undefined
    }
    throw Error(`${style} is not a style string or a unmber|undefined`)
}

export {
    parseNumberFromStyle
}