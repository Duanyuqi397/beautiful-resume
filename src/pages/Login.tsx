import { Button, Form, Input, message, Layout } from 'antd'
import client from '../core/network/client'
import {useState} from 'react'
import { useQuery } from '../core/hooks'
import { useHistory } from 'react-router-dom'
const { Header, Footer, Sider, Content } = Layout;


function isLoginPage(){
    return window.location.href.endsWith('login')
}

export default function Login(){
    const [form] = Form.useForm();
    const [doRegister, registerStatus] = useQuery(user => client.post('register', user))
    const [doLogin, loginStatus] = useQuery(user => client.post('login', user))
    const mode = (registerStatus === 'success') || isLoginPage() ? 'login' : 'register';
    const history = useHistory()

    function register(data: any){
        doRegister(data).then(() => message.info('注册成功'))
    }

    function login(data: any){
        doLogin(data)
          .then((data) => {
            if(!data.token){
                message.error("获取 token 失败")
                return
            }
            window.localStorage.setItem("tk", data.token)
            setTimeout(() => history.push('resumes'), 500)
          })
    }
    
    return (
        <div style={{ position: 'absolute', top: '30%', width: '100%'}}>
            {/* <h6 style={{fontSize: '5em'}}>可历，开启新生活</h6> */}
            <div style={{justifyContent: 'center', display: 'flex', marginTop: '2em'}}>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 6}}
                style={{ position: 'relative', width: '30%'}}
                initialValues={{username: ' ', password: '', passwordConfirm: ''}}
                onFinish={mode === 'login' ? login: register}
                autoComplete="off"
            >
            <Form.Item
                label="用户名"
                name="userName"
                rules={[
                        {
                            required: true,
                            message: '用户名不能为空'
                        },
                        { 
                            pattern: /[0-9a-zA-Z-_]{4,}/, 
                            message: '用户名只能包含数字，字母下划线以及-,且不少于4位',
                        }
                    ]
                }
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="userPwd"
                rules={[
                    {
                        required: true,
                        message: '密码不能为空'
                    },
                    { pattern: /(\S| ){6,}/, message: '密码不能小于6位' }]}
            >
                <Input.Password />
            </Form.Item>
            {
                mode === 'register' ? (
                    <Form.Item
                        label="确认密码"
                        name="pwdConfirm"
                        rules={[
                            ({getFieldValue})=>({
                                validator(rule, value){
                                    if(!value || getFieldValue('userPwd') === value){
                                        return Promise.resolve()
                                    }
                                    return Promise.reject("两次密码输入不一致")
                                }
                            }),
                            {
                                required: true,
                                message: '两次输入的密码不一致'
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                ) : null
            }
            <Form.Item wrapperCol={{span: 4, offset: 12}}>
                <Button block disabled={registerStatus === 'processing' || loginStatus === 'processing'} type="primary" htmlType="submit">
                    {mode === 'login' ? '登录': '注册'}
                </Button>
            </Form.Item>
        </Form>
            </div>
        </div>
    )
}