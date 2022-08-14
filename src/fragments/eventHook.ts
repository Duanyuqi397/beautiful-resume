import * as React from 'react'

export default function useEvent<T extends Function>(callback: T): T{
    const callbackRef = React.useRef(callback)
  
    callbackRef.current = callback

    return React.useCallback((...args: any[]) => {
        callbackRef.current(...args)
    }, []) as unknown as T
}