import { Card, Col, Row, Modal, Input, message } from 'antd';
import React, {useEffect, useState} from 'react';
import coverUrl from '../assets/mock.png'
import { client } from '../core/network'
import { useQuery } from '../core/hooks'
import { Link, useHistory } from "react-router-dom";
import { Button, Tooltip, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
 

const { Meta } = Card;
type ResumeResp = {
    name: string,
    _id: string
}

const ResumeList: React.FC = () => {
    const [resumes, setResumes] = useState<ResumeResp[]>([])
    const history = useHistory()
    const [ getResume, data] = useQuery(() => client.get("resume"))
    const [ addResume, status] = useQuery((data) => client.post('resume', data))
    useEffect(() => {
        getResume().then(data => setResumes(data as ResumeResp[]))
    }, [])
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState('')

    function createResume(resumeName: string){
        addResume({name: resumeName})
        .then((data) => {
            message.info("创建成功")
            setResumes([...resumes, {
                _id: data.id,
                name: data.name
            }])
        })
        .finally(() => setShowModal(false))
    }

    return (
        <div style={{backgroundColor: 'rgb(245, 245, 247)', padding: '16px'}}>
            <Modal
                open={showModal}
                title="请输入简历名称"
                onCancel={() => setShowModal(false)}
                onOk={() => createResume(name)}
                okText="创建"
                cancelText="取消"
            >
                <Input 
                    onChange={e => setName(e.target.value)}
                />
            </Modal>
            <div style={{position: 'fixed', zIndex: 999, left: '95%', top: '90%'}}>
            <Button size='large'  type="primary" shape='circle' onClick={() => setShowModal(true)} icon={<PlusOutlined />}>
            </Button>
            </div>
            <Row gutter={16} align="top">
                {
                    resumes.map(resp => (
                        <Col span={8} key={resp._id} >
                            <Card
                                onClick={() => history.push(`resume/${resp._id}`)}
                                title={resp.name}
                                style={{marginBottom: '16px', cursor: 'pointer'}}
                            >
                               <div style={{height: '500px'}}>
                               </div>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    )
}

export default ResumeList;