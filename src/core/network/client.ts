import axios, {AxiosResponse} from 'axios'
import { message } from 'antd'

const BASE_URL = process.env.NODE_ENV === "development" ? 'http://127.0.0.1:3001':'http://www.keli-resume.cn:14001'

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000
})

const URL_DONT_NEED_AUTH = [
    'register',
    'login'
]

instance.interceptors.request.use(
    config => {
        const { url } = config
        if(!URL_DONT_NEED_AUTH.includes(url?.replace(/^\//, '') ?? '')){
            const { localStorage } = window
            if(config.method?.toUpperCase() === 'OPTIONS'){
                return config
            }
            if (config.headers) {
                config.headers["Authorization"] = 'Bearer ' + localStorage.getItem('tk'); // no errors
            }        
        }
        return config
    }
)

type ResponseInterceptor = (response: AxiosResponse<any, any>) => Promise<any>

const successInterceptor: ResponseInterceptor = (response) => {
    if(!response.data.data && response.config.method?.toUpperCase() !== "OPTIONS"){
        console.error(`status code is 200, data not found response, url=${response.config.url}, response=${response.data}`)
        return Promise.reject("服务器响应错误")
    }
    return Promise.resolve(response.data.data)
}

const failedInterceptor: (error: any) => any = (error) => {
    let message = error.response?.data?.message
    if(message){
        return Promise.reject(message)
    }
    message = error.message
    console.info(error)
    if(message?.includes("timeout")){
        return Promise.reject("请求超时，请稍后再试")
    }else if(message === "Network Error"){
        return Promise.reject("您的网络似乎出现了一点问题")
    }
    return Promise.reject(error)
}

instance.interceptors.response.use(successInterceptor, failedInterceptor)


function withErrorMessage(){
    return (promise: Promise<any>) => {
        return promise
                .then(x => x)
                .catch(message => {
                    message.error(message)
                    return Promise.reject(message)
                })
    }
}

export default instance
export {withErrorMessage}