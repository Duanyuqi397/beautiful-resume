import { useState } from 'react'
import { RequestStatus } from '../types'
import { AxiosResponse } from 'axios'
import { message } from 'antd'

function useQuery(promiseCaller: (...data: any) => Promise<AxiosResponse<any>>, showError=true){
    const [status, setStatus] = useState<RequestStatus>('idle')
    const [error, setError] = useState<string|undefined>()
    const [data, setData] = useState<any>()
    function doQuery(...data: any): Promise<any>{
        setStatus('processing')
        const res = promiseCaller(...data)
                .then(res => {
                    setStatus('success')
                    return res
                })
                .catch(error => {
                    setStatus('failed')
                    if(showError){
                        message.error(error.toString())
                    }
                    return Promise.reject(error)
                })
        return res;
    }

    return [
        doQuery,
        status
    ] as const
}

export { useQuery }