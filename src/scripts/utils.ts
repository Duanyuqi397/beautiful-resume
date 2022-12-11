import { EditorProps } from '../types/types'

function parseNumberFromStyle(style: undefined): undefined
function parseNumberFromStyle(style: number | string): number
function parseNumberFromStyle(style: number | string | undefined): undefined | number {
    if (typeof style === 'string' && style.endsWith("px")) {
        return parseInt(style.slice(0, -2))
    } else if (typeof style === 'number') {
        return style
    } else if (typeof style === 'undefined') {
        return undefined
    }
    throw Error(`${style} is not a style string or a unmber|undefined`)
}

function removeKeys(object: any, keys: string[]) {
    return Object.fromEntries(
        Object.entries(object).filter(([k, v]) => !keys.includes(k.toString()))
    )
}

type ConfigPath = { path: string[], config: EditorProps }

function flatConfigs(configs: any): ConfigPath[] {
    function helper(path: string[], configs: any): ConfigPath[] {
        return Object.entries(configs)
            .map(([k, v]) => {
                if (v instanceof EditorProps) {
                    return [{ path: [...path, k], config: v as EditorProps }]
                } else {
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
                if (sourceType !== targetType && targetType === 'object' && sourceValue && targetValue) {
                    throw new Error('schema not match')
                }
                if ((key in target) && targetType === 'object' && targetValue !== null && !Array.isArray(targetValue)) {
                    return [key, merge(targetValue, sourceValue)]
                } else {
                    return [key, sourceValue]
                }
            })
    )
    return { ...t, ...mergedTarget }
}

function debounce<T extends Function>(func: T, debounceMs: number): T {
    let intv: any = null
    function wrapper(...args: any) {
        if (intv !== null) {
            clearTimeout(intv)
        }
        intv = setTimeout(() => {
            intv = null
            func(...args)
        }, debounceMs)
    }
    return wrapper as any as T
}

// function parseBorder(border: undefined): undefined
// function parseBorder(border: string): {width: string, style: string, color: string}
function parseBorder(border: string | undefined) {
    if (typeof border === 'string') {
        const parts = border.split(" ")
        return {
            width: parts[0],
            style: parts[1],
            color: parts.slice(2).join(" ")
        }
    }
    return undefined
}

function groupBy<T, K extends string | number>(array: T[], keyFunc: (item: T) => K): { [P in K]: T[] } {
    const res = new Map<K, T[]>()
    array.forEach(item => {
        const key = keyFunc(item)
        if (res.has(key)) {
            res.get(key)?.push(item)
        } else {
            res.set(key, [item])
        }
    })
    return Object.fromEntries(res.entries()) as unknown as { [P in K]: T[] }
}

function adjustImage(url: string, componentWidth: number) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve, reject) => {
        img.onload = resolve
    }).then((e: any) => {
        const height = e.path[0].naturalHeight;
        const width = e.path[0].naturalWidth;
        const realHeight = (componentWidth / width) * height;
        return { componentWidth, realHeight };
    })
}

const Identify = <T>(x: T) => x



export {
    parseNumberFromStyle,
    removeKeys,
    merge,
    flatConfigs,
    debounce,
    parseBorder,
    groupBy,
    Identify,
    adjustImage
}

export type {
    ConfigPath
}