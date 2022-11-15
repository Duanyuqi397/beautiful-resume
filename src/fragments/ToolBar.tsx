import * as React from 'react'
import { Col, Row, Button, MenuProps, Menu, Dropdown, Space } from 'antd';
import { 
    UndoOutlined, 
    RedoOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    VerticalLeftOutlined,
    VerticalRightOutlined,
    BorderVerticleOutlined,
    ColumnWidthOutlined,
    ColumnHeightOutlined,
    DeleteOutlined,
    VerticalAlignTopOutlined,
    VerticalAlignMiddleOutlined,
    VerticalAlignBottomOutlined,
    BorderTopOutlined,
    BorderBottomOutlined,
} from '@ant-design/icons'
import { 
    useHistory,
    useActives,
    useApp,
    useRoot,
} from '../core/hooks/appHook'
import { useKeyboardEvent } from '../core/hooks/eventHook'

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
      icon: <VerticalRightOutlined />,
    },
    {
      label: '居中对齐',
      key: 'center',
      icon: <BorderVerticleOutlined />,
    },
    {
      label: '右对齐',
      key: 'right',
      icon: <VerticalLeftOutlined />,
    },
]

const yAlignMenuItems = [
    {
      label: '顶端对齐',
      key: 'top',
      icon: <BorderTopOutlined />,
    },
    {
      label: '居中对齐',
      key: 'center',
      icon: <BorderVerticleOutlined />,
    },
    {
      label: '底部对齐',
      key: 'bottom',
      icon: <BorderBottomOutlined />,
    },
]
const ToolBar: React.FC<any> = (porps) => {
    const {redo, undo} = useHistory()
    const {actives, activeIds} = useActives()
    const {batchMerge, remove} = useApp()
    const { root } = useRoot()
    const activeMoreThanOne = activeIds.length > 1
    
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
    
    return (
        <>
            <Row justify='center'>
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
                        <Button icon={<VerticalRightOutlined />} size="large" type="text"></Button>
                    </Dropdown >
                </Col>

                <Col>
                    <Dropdown disabled={!activeMoreThanOne} overlay={<Menu items={yAlignMenuItems} onClick={e => yAlignPosition(e.key)} />} >
                        <Button icon={<BorderBottomOutlined />} size="large" type="text"></Button>
                    </Dropdown >
                </Col>
 
                <Col><Button size="large" type="text" onClick={fullWidth} icon={<ColumnWidthOutlined /> }/></Col>
                <Col><Button size="large" type="text" onClick={fullHeight} icon={<ColumnHeightOutlined /> }/></Col>
                <Col><Button size="large" type="text" disabled={actives.length <= 0} onClick={deleteAll} icon={<DeleteOutlined /> }/></Col>
            </Row>
        </>
    )
}

export default ToolBar