import * as React from 'react'

function useEvent<T extends Function>(callback: T): T{
    const callbackRef = React.useRef(callback)
    callbackRef.current = callback
    return React.useCallback((...args: any[]) => {
        callbackRef.current(...args)
    }, []) as unknown as T
}

function useKeyboardEvent(callback: (e: KeyboardEvent) => void, code?: string){
    const eventCallback = useEvent((event: KeyboardEvent) => {
        if(!code || event.code === code){
            callback(event)
        }
    })
    React.useEffect(() => {
        document.addEventListener("keydown", eventCallback);
        return () => document.removeEventListener("keydown", eventCallback)
    }, [])
}

function useCopyPasteEvent(type: "copy"|"paste", callback: (e: ClipboardEvent) => void){
    const eventCallback = useEvent(callback)
    React.useEffect(() => {
        document.addEventListener(type, eventCallback)
        return () => document.removeEventListener(type, eventCallback)
    })
}

export {
    useEvent,
    useKeyboardEvent,
    useCopyPasteEvent,
}