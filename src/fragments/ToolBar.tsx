import * as React from 'react'
import { Col, 
    Row, 
    Button, 
    Menu, 
    Dropdown,
    Modal,
    Input,
    message,
    Upload,
} from 'antd';

import type { UploadChangeParam, UploadFile, RcFile } from 'antd/es/upload';

import Icon, { 
    UndoOutlined, 
    RedoOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    ColumnWidthOutlined,
    ColumnHeightOutlined,
    DeleteOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignMiddleOutlined,
    VerticalAlignBottomOutlined,
    DownloadOutlined,
    FilePdfOutlined,
    UploadOutlined,
} from '@ant-design/icons'

import { 
    useHistory,
    useActives,
    useApp,
    useRoot,
    useSerialize
} from '../core/hooks/appHook'

import { useKeyboardEvent } from '../core/hooks/eventHook'

import { toLookup } from '../core/utils'
import SelectEditor from '../fragments/SelectEditor'

import exportPDF from '../scripts/exportPDF'
import FilSaver from 'file-saver'

const LeftAlignIcon: React.FC = (props) => (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1633" {...props}>
        <path d="M343.04 799.004444v-56.888888h227.555556v56.888888z" p-id="1634"></path><path d="M302.648889 810.951111l-40.248889-40.248889 120.689778-120.689778 40.220444 40.248889z" p-id="1635"></path><path d="M262.599111 770.275556l40.220445-40.220445 120.689777 120.689778-40.248889 40.220444zM262.542222 379.164444h568.888889v227.555556h-568.888889zM262.542222 151.608889h341.333334v170.666667h-341.333334zM148.764444 94.72h56.888889v853.333333h-56.888889z" p-id="1636"></path>
    </svg>
)

const RightAlignIcon: React.FC = (props) => (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1654" {...props}><path d="M398.222222 799.004444v-56.888888h227.555556v56.888888z" p-id="1655"></path><path d="M545.28 689.777778l40.220444-40.192 120.661334 120.661333-40.220445 40.248889z" p-id="1656"></path><path d="M585.443556 891.164444l-40.220445-40.248888 120.661333-120.661334 40.248889 40.220445zM705.991111 606.72h-568.888889v-227.555556h568.888889zM705.991111 322.275556h-341.333333v-170.666667h341.333333zM819.768889 948.053333h-56.888889v-853.333333h56.888889z" p-id="1657"></path></svg>
)

const CenterXAlignIcon: React.FC = (props) => (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1814" {...props}><path d="M222.72 521.386667h568.888889v227.555555h-568.888889zM336.497778 293.831111h341.333333v170.666667h-341.333333z" p-id="1815"></path><path d="M478.72 151.608889h56.888889v739.555555h-56.888889z" p-id="1816"></path></svg>
)

const TopAlignIcon: React.FC = (props) => (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1973" {...props}><path d="M777.955556 601.884444h-56.888889v-227.555555h56.888889z" p-id="1974"></path><path d="M668.814222 454.684444L628.622222 414.435556l120.689778-120.689778 40.220444 40.220444z" p-id="1975"></path><path d="M869.944889 414.663111l-40.248889 40.220445-120.661333-120.661334 40.220444-40.248889zM585.671111 293.831111v568.888889h-227.555555v-568.888889zM301.226667 293.831111v341.333333h-170.666667v-341.333333zM927.004444 180.053333v56.888889h-853.333333v-56.888889z" p-id="1976"></path></svg>
)

const CenterYAlignIcon: React.FC = (props) => (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2289" {...props}><path d="M486.968889 805.831111v-568.888889h227.555555v568.888889zM259.413333 692.053333v-341.333333h170.666667v341.333333z" p-id="2290"></path><path d="M117.191111 549.831111v-56.888889h739.555556v56.888889z" p-id="2291"></path></svg>)

const BottomAlignIcon: React.FC = (props) => (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2448" {...props}><path d="M764.017778 668.728889h-56.888889v-227.555556h56.888889z" p-id="2449"></path><path d="M775.964444 708.807111l-40.220444 40.220445-120.689778-120.689778 40.220445-40.220445z" p-id="2450"></path><path d="M735.573333 749.198222l-40.220444-40.248889 120.661333-120.661333 40.248889 40.220444zM344.177778 748.942222v-568.888889h227.555555v568.888889zM116.622222 748.942222v-341.333333h170.666667v341.333333zM59.733333 862.72v-56.888889h853.333334v56.888889z" p-id="2451"></path></svg>)

const IncreaseLayerIcon: React.FC = (props) => (
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="933" {...props}><path d="M677.831111 483.555556v56.888888h170.666667v341.333334h-341.333334v-170.666667h-56.888888v227.555556h455.111111V483.555556h-227.555556z" p-id="934"></path><path d="M52.053333 85.333333h568.888889v568.888889h-568.888889z" p-id="935"></path></svg>)

const DecreaseLayerIcon: React.FC = (props) => (
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1094" {...props}><path d="M585.671111 597.333333h-455.111111V142.222222h455.111111z m56.888889-512h-568.888889v568.888889h568.888889z" p-id="1095"></path><path d="M699.448889 483.555556v227.555555h-227.555556v227.555556h455.111111V483.555556h-227.555555z" p-id="1096"></path></svg>)

const xPositionMenuItems = [
    {
      label: '靠左放置',
      key: 'left',
      icon: <AlignLeftOutlined />,
    },
    {
      label: '居中放置',
      key: 'center',
      icon: <AlignCenterOutlined />,
    },
    {
      label: '靠右放置',
      key: 'right',
      icon: <AlignRightOutlined />,
    },
]

const yPositionMenuItems = [
    {
      label: '靠顶部放置',
      key: 'top',
      icon: <VerticalAlignTopOutlined />,
    },
    {
      label: '居中放置',
      key: 'center',
      icon: <VerticalAlignMiddleOutlined />,
    },
    {
      label: '靠底部放置',
      key: 'bottom',
      icon: <VerticalAlignBottomOutlined />,
    },
]

const xAlignMenuItems = [
    {
      label: '左对齐',
      key: 'left',
      icon: <Icon component={LeftAlignIcon}/>,
    },
    {
      label: '居中对齐',
      key: 'center',
      icon: <Icon component={CenterXAlignIcon}/>,
    },
    {
      label: '右对齐',
      key: 'right',
      icon: <Icon component={RightAlignIcon}/>,
    },
]

const yAlignMenuItems = [
    {
      label: '顶端对齐',
      key: 'top',
      icon: <Icon component={TopAlignIcon}/>,
    },
    {
      label: '居中对齐',
      key: 'center',
      icon: <Icon component={CenterYAlignIcon}/>,
    },
    {
      label: '底部对齐',
      key: 'bottom',
      icon: <Icon component={BottomAlignIcon}/>,
    },
]

const layerManageItem = [
    {
      label: '上移一层',
      key: 'increase',
      icon: <Icon component={IncreaseLayerIcon}/>,
    },
    {
      label: '下移一层',
      key: 'decrease',
      icon: <Icon component={DecreaseLayerIcon}/>,
    },
]



function useLayer(){
    const { components, batchMerge } = useApp()
    const layerComponentLookup = toLookup(components, c => c.props.layer)
    const layers = Array.from(layerComponentLookup.keys())
    const maxLayer = Math.max(...layers)

    function inner(id: string){
        const component = components.filter(c => c.id === id)
        if(component.length <= 0){
            throw new Error('can find component ' + id)
        }
        const layer = component[0].props.layer
        function increse(){
            let nextLayer = layer + 1
            while(nextLayer <= maxLayer){
                if(layerComponentLookup.has(nextLayer)){
                    break
                }
                nextLayer += 1
            }
            if(nextLayer > maxLayer){
                return
            }
            const nextLayerComponent = layerComponentLookup.get(nextLayer)!
            batchMerge([
                [id, {layer: nextLayer}],
                [nextLayerComponent.id, {layer}]
            ])
        }
        function decrese(){
            let nextLayer = layer - 1
            while(nextLayer >= 1){
                if(layerComponentLookup.has(nextLayer)){
                    break
                }
                nextLayer -= 1
            }
            if(nextLayer < 1){
                return
            }
            const nextLayerComponent = layerComponentLookup.get(nextLayer)!
            batchMerge([
                [id, {layer: nextLayer}],
                [nextLayerComponent.id, {layer}]
            ])
        }
        return {
            increse,
            decrese
        }
    }
    return inner
}


type ToolBarProps = {
    container?: HTMLElement
}

const ToolBar: React.FC<ToolBarProps> = (porps) => {
    const {redo, undo} = useHistory()
    const {actives, activeIds} = useActives()
    const {batchMerge, remove, activite, components} = useApp()
    const { root } = useRoot()
    const activeMoreThanOne = activeIds.length > 1
    const layerManage = useLayer()
    const firstActiveId = activeIds[0]
    const [showModal, setShowModal] = React.useState(false)
    const [name, setName] = React.useState('')
    const [exportType, setExportType] = React.useState("JSON")
    const {serialize, deserialize} = useSerialize()
    const {
        container,
    } = porps

    const exportItem = [
        {
          label: '保存为PDF文件',
          key: 'pdf',
          icon: <FilePdfOutlined/>,
        },
        {
          label: '保存为JSON文件(可导入)',
          key: 'json',
          icon: (
            <FilePdfOutlined/>
          ),
        },
    ]

    useKeyboardEvent((e) => {
        if(e.code !== 'KeyZ'){
            return
        }
        if(e.ctrlKey){
            if(e.shiftKey){
                redo()
            }else{
                undo()
            }
        }
    })

    function alignLeftWith(x: number){
        batchMerge(actives.map(c => [c.id, {position: [x, c.props.position[1]]}]))
    }

    function alignTopWith(y: number){
        batchMerge(actives.map(c => [c.id, {position: [c.props.position[0], y]}]))
    }

    function alignTopWithRoot(){
        alignTopWith(0)
    }

    function alignCenterWithRoot(){
        const rootHeight = root.props.size[1]
        batchMerge(actives.map(c => {
            const newY = rootHeight / 2 - c.props.size[1] / 2
            return [c.id, {position: [c.props.position[0], Math.floor(newY)]}]
        }))
    }

    function alignBottomWithRoot(){
        batchMerge(actives.map(c =>[c.id, {position: [c.props.position[0], root.props.size[1] - c.props.size[1]]}]))
    }

    function alignLeftWithRoot(){
        alignLeftWith(0)
    }

    function alignRightWithRoot(){
        const rootWidth = root.props.size[0]
        batchMerge(actives.map(c => [c.id, {position: [rootWidth - c.props.size[0], c.props.position[1]]}]))
    }

    function alignXCenterWithRoot(){
        const rootWidth = root.props.size[0]
        batchMerge(actives.map(c => {
            const newX = rootWidth / 2 - c.props.size[0] / 2
            return [c.id, {position: [Math.floor(newX), c.props.position[1]]}]
        }))
    }

    
    function alignLeftWithFirst(){
        alignLeftWith(actives[0].props.position[0])
    }

    function alignRightWithFirst(){
        const firstActiveProps = actives[0].props
        const alignWidht = firstActiveProps.position[0] + firstActiveProps.size[0]
        batchMerge(actives.slice(1).map(c => [c.id, {position: [alignWidht - c.props.size[0], c.props.position[1]]}]))
    }

    function alignXCenterWithFirst(){
        const firstActiveProps = actives[0].props
        const alignWidht = firstActiveProps.position[0] + firstActiveProps.size[0] / 2
        batchMerge(actives.slice(1).map(c => {
            const newX = alignWidht - c.props.size[0] / 2
            return [c.id, {position: [newX, c.props.position[1]]}]
        }))
    }

    function alignTopWithFirst(){
        alignTopWith(actives[0].props.position[1])
    }

    function alignYCenterWithFirst(){
        const firstActiveProps = actives[0].props
        const alignHeight = firstActiveProps.position[1] + firstActiveProps.size[1] / 2
        batchMerge(actives.slice(1).map(c => {
            const newX = alignHeight - c.props.size[1] / 2
            return [c.id, {position: [c.props.position[0], newX]}]
        }))
    }

    function alignBottomWithFirst(){
        const firstActiveProps = actives[0].props
        const alignHeight = firstActiveProps.position[1] + firstActiveProps.size[1]
        batchMerge(actives.slice(1).map(c => [c.id, {position: [c.props.position[0], alignHeight - c.props.size[1]]}]))
    }

    function fullWidth(){
        batchMerge(actives.map(c => [c.id, {position: [0, c.props.position[1]], size: [root.props.size[0], c.props.size[1]]}]))
    }

    function fullHeight(){
        batchMerge(actives.map(c => [c.id, {position: [c.props.position[0], 0],  size: [c.props.size[0], root.props.size[1]]}]))
    }

    function deleteAll(){
        remove(activeIds)
    }

    function xPlacePosition(position: string){
        switch(position){
            case "left": alignLeftWithRoot(); break;
            case "center": alignXCenterWithRoot(); break;
            case "right": alignRightWithRoot(); break;
            default:;
        }
    }

    function yPlacePosition(position: string){
        switch(position){
            case "top": alignTopWithRoot(); break;
            case "center": alignCenterWithRoot(); break
            case "bottom": alignBottomWithRoot(); break;
        }
    }

    function xAlignPosition(position: string){
        switch(position){
            case "left": alignLeftWithFirst(); break;
            case "center": alignXCenterWithFirst(); break;
            case "right": alignRightWithFirst(); break;
        }
    }

    function yAlignPosition(position: string){
        switch(position){
            case "top": alignTopWithFirst(); break;
            case "center": alignYCenterWithFirst(); break;
            case "bottom": alignBottomWithFirst(); break;
        }
    }

    function changeLayer(type: string){
        if(!firstActiveId){
            return
        }
        if(type === 'increase'){
            layerManage(firstActiveId).increse()
        }else if(type === 'decrease'){
            layerManage(firstActiveId).decrese()
        }
    }

    function exportToFile(){
        if(name.trim().length === 0){
            message.warn("简历名称不能为空")
            return
        }
        setShowModal(false)
        if(exportType === "PDF"){
            activite([])
            setTimeout(() => (container && exportPDF(name, container)), 0)
        }else if(exportType === "JSON"){
            const blob = new Blob([serialize()], {type: "text/plain;charset=utf-8"});
            FilSaver.saveAs(blob, `${name}.keli`);
        }
    }

    const handleChange = (file: RcFile) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => deserialize(reader.result as string))
        reader.readAsText(file)
    }

    return (
        <>
            <Row justify='center' align='middle'>
                <Col>
                    <Upload
                        beforeUpload={handleChange}
                        accept=".keli"
                        showUploadList={false}
                        maxCount={1}
                        multiple={false}
                    >
                        <Button icon={<UploadOutlined/>} size="large" type="text"></Button>
                    </Upload>
                </Col>

                <Col><Button size="large" type="text" onClick={undo} icon={<UndoOutlined />}/></Col>
                <Col><Button size="large" type="text" onClick={redo} icon={<RedoOutlined />}/></Col>
                <Col>
                    <Dropdown overlay={<Menu items={xPositionMenuItems} onClick={e => xPlacePosition(e.key)} />} >
                        <Button icon={<AlignLeftOutlined />} size="large" type="text"></Button>
                    </Dropdown >
                </Col>

                <Col>
                    <Dropdown overlay={<Menu items={yPositionMenuItems} onClick={e => yPlacePosition(e.key)} />} >
                        <Button icon={<VerticalAlignTopOutlined />} size="large" type="text"></Button>
                    </Dropdown >
                </Col>

                <Col>
                    <Dropdown disabled={!activeMoreThanOne} overlay={<Menu items={xAlignMenuItems} onClick={e => xAlignPosition(e.key)} />} >
                        <Button icon={<Icon component={LeftAlignIcon}/>} size="large" type="text"></Button>
                    </Dropdown >
                </Col>

                <Col>
                    <Dropdown disabled={!activeMoreThanOne} overlay={<Menu items={yAlignMenuItems} onClick={e => yAlignPosition(e.key)} />} >
                        <Button icon={<Icon component={TopAlignIcon}/>} size="large" type="text"></Button>
                    </Dropdown >
                </Col>

                <Col>
                    <Dropdown overlay={<Menu items={layerManageItem} onClick={e => changeLayer(e.key)} />} >
                        <Button icon={<Icon component={IncreaseLayerIcon}/>} size="large" type="text"></Button>
                    </Dropdown >
                </Col>
 
                <Col><Button size="large" type="text" onClick={fullWidth} icon={<ColumnWidthOutlined /> }/></Col>
                <Col><Button size="large" type="text" onClick={fullHeight} icon={<ColumnHeightOutlined /> }/></Col>
                <Col><Button size="large" type="text" disabled={actives.length <= 0} onClick={deleteAll} icon={<DeleteOutlined /> }/></Col>
                <Col>
                    <Button onClick={() => setShowModal(!showModal)} icon={<DownloadOutlined/>} size="large" type="text"></Button>
                </Col>
               
            </Row>
            
            <Modal
                open={showModal}
                title="请输入简历名称"
                onCancel={() => setShowModal(false)}
                onOk={() => exportToFile()}
                okText="下载"
                cancelText="取消"
            >
                
                <Input 
                    addonBefore={
                        (
                            <SelectEditor
                                options={[
                                    {name: "保存为PDF", value: "PDF"},
                                    {name: "保存为JSON(可导入)", value: "JSON"}
                                ]}
                                value={exportType}
                                onChange={e => setExportType(e)}
                            />
                        )
                    }
                    onChange={e => setName(e.target.value)}
                />
            </Modal>
        
        </>
    )
}

export default ToolBar