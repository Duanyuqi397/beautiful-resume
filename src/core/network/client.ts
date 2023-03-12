import axios, {AxiosResponse} from 'axios'
import { message } from 'antd'

const BASE_URL = process.env.NODE_ENV === "development" ? 'http://127.0.0.1:3001':'http://www.keli-resume.cn:14001'

const instance = axios.create({
    baseURL: '',
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
    return Promise.resolve(response.data.data)
}

const failedInterceptor: (error: any) => any = (error) => {
    const data = error.response.data
    if(data?.message){
        return Promise.reject(data.message)
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