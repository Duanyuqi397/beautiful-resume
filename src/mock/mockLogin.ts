import MockAdapter from 'axios-mock-adapter'

export function mockRegister(mock: MockAdapter){
    mock.onPost("/register").reply((config) => {
        const data = JSON.parse(config.data)
        console.info(data)
        if(data['userName'] === 'user1'){
            return [
                200, {
                    status: 'success',
                    message: ''
                }
            ]
        }else{
            return [
                400,
                {
                    status: 'failed',
                    message: '用户名已存在，请重试'
                }
            ]
        }
    })
    .onPost("/login").reply((config) => {
        const data = JSON.parse(config.data)
        if(data['userName'] === 'user1'){
            return [
                200, {
                    status: 'success',
                    message: '',
                    data: {
                        token: "$test_token"
                    }
                }
            ]
        }else{
            return [
                400,
                {
                    status: 'failed',
                    message: '登录失败，用户不存在或密码错误'
                }
            ]
        }
    })
    .onGet("resumes").reply(200, {
        "status": "success",
        "data": [
            {
                "name": "HelloWorld",
                "_id": "2132131322"
            },
            {
                "name": "HelloWorld",
                "_id": "21321313221"
            },{
                "name": "HelloWorld",
                "_id": "21321313222"
            }
        ]
    })
    .onPost("resume").reply(200, {
        "status": "success",
        "data": {
                "name": "新建简历",
                "id": "456456"
            }
    })
    .onGet(new RegExp("/components/.*")).reply(200, {
        status: "success",
        data: [{"type":"div","id":"__root-container__","props":{"id":"root-container","position":[0,0],"size":[635,898],"layer":0,"style":{"backgroundColor":"white","position":"relative","margin":"auto"}},"children":["2ad1e16a-c251-4610-a6c9-c3e9a4d12530","b46bc072-0d63-437e-a27a-b70114016779"],"parent":"","canActive":false,"canDrag":false},{"parent":"__root-container__","children":[],"props":{"style":{"left":0,"top":0,"position":"absolute"},"position":[332,99],"size":[150,150],"layer":1},"type":"BaseContainer","id":"2ad1e16a-c251-4610-a6c9-c3e9a4d12530"},{"parent":"__root-container__","children":[],"props":{"style":{"left":0,"top":0,"position":"absolute","zIndex":0,"borderWidth":0,"borderStyle":"none"},"position":[101,118],"size":[150,150],"layer":2,"content":{"html":"<p style=\"text-align: left; line-height: 1;\"><span style=\"font-size: 14px; font-family: 微软雅黑;\">123132131313</span></p>","text":"123132131313"}},"type":"BaseTextArea","id":"b46bc072-0d63-437e-a27a-b70114016779"}]
    })
}

 