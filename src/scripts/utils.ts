import { EditorProps, ConfigProps } from '../types/types'
import { useCallback, useRef } from 'react'

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

function removeKeys(object: any, keys: string[]){
    return Object.fromEntries(
        Object.entries(object).filter(([k, v]) => !keys.includes(k.toString()))
    )
}

type ConfigPath = {path: string[], config: EditorProps}

function flatConfigs(configs: any): ConfigPath[]{
    function helper(path: string[], configs: any): ConfigPath[]{
        return Object.entries(configs)
        .map(([k, v]) => {
            if(v instanceof EditorProps){
                return [{path: [...path, k], config: v as EditorProps}]
            }else{
                return helper([...path, k], v)
            }
        })
        .reduce((x, y) => [...x, ...y])
    }
    return helper([], configs)
}

function merge(t: any, source: any): any {
    const target = t as any
    const mergedTarget = Object.fromEntries(
        Object.entries(source)
            .map(([key, sourceValue]) => {
                const targetValue = target[key] as any
                const sourceType = typeof sourceValue
                const targetType = typeof targetValue
                if(targetType !== 'undefined' && sourceType !== targetType){
                    throw new Error('schema not match')
                }
                if (key in target && targetType === 'object'){
                    return [key, merge(targetValue, sourceValue)]
                }else{
                    return [key, sourceValue]
                }
            })
    )
    return {...t, ...mergedTarget}
}

function debounce<T extends Function>(func: T, debounceMs: number): T{
    let intv: any = null
    function wrapper(...args: any){
        if(intv !== null){
            clearTimeout(intv)
        }
        intv = setTimeout(() => {
            intv = null
            func(...args)
        }, debounceMs)
    }
    return wrapper as any as T
}

export {
    parseNumberFromStyle,
    removeKeys,
    merge,
    flatConfigs,
    debounce
}