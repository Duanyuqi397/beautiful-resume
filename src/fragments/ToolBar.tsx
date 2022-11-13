import * as React from 'react'
import { Col, Row, Button} from 'antd';
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
} from '@ant-design/icons'
import { 
    useHistory,
    useActives,
    useApp,
    useRoot,
} from '../core/hooks/appHook'
const ToolBar: React.FC<any> = (porps) => {
    const {redo, undo} = useHistory()
    const {actives, activeIds} = useActives()
    const {batchMerge, remove} = useApp()
    const { root } = useRoot()
    const activeMoreThanOne = activeIds.length > 1
    console.info('aaaa', actives)
    function alignLeftWith(x: number){
        batchMerge(actives.map(c => [c.id, {position: [x, c.props.position[1]]}]))
    }

    function alignLeftWithRoot(){
        alignLeftWith(0)
    }

    function alignRightWithRoot(){
        const rootWidth = root.props.size[0]
        batchMerge(actives.map(c => [c.id, {position: [rootWidth - c.props.size[0], c.props.position[1]]}]))
    }

    function alignCenterWithRoot(){
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
        const rootWidth = firstActiveProps.position[0] + firstActiveProps.size[0]
        batchMerge(actives.slice(1).map(c => [c.id, {position: [rootWidth - c.props.size[0], c.props.position[1]]}]))
    }

    function alignCenterWithFirst(){
        const firstActiveProps = actives[0].props
        const rootWidth = firstActiveProps.position[0] + firstActiveProps.size[0] / 2
        batchMerge(actives.slice(1).map(c => {
            const newX = rootWidth - c.props.size[0] / 2
            return [c.id, {position: [newX, c.props.position[1]]}]
        }))
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
    
    return (
        <>
            <Row justify='center'>
                <Col><Button type="text" onClick={undo} icon={<UndoOutlined />}/></Col>
                <Col><Button type="text" onClick={redo} icon={<RedoOutlined />}/></Col>
                <Col><Button type="text" onClick={alignLeftWithRoot} icon={<AlignLeftOutlined />}/></Col>
                <Col><Button type="text" onClick={alignCenterWithRoot} icon={<AlignCenterOutlined /> }/></Col>
                <Col><Button type="text" onClick={alignRightWithRoot} icon={<AlignRightOutlined />}/></Col>
                <Col><Button type="text" disabled={!activeMoreThanOne} onClick={alignLeftWithFirst} icon={<VerticalRightOutlined />}/></Col>
                <Col><Button type="text" disabled={!activeMoreThanOne} onClick={alignCenterWithFirst} icon={<BorderVerticleOutlined />}/></Col>
                <Col><Button type="text" disabled={!activeMoreThanOne} onClick={alignRightWithFirst} icon={<VerticalLeftOutlined />}/></Col>
                <Col><Button type="text" onClick={fullWidth} icon={<ColumnWidthOutlined /> }/></Col>
                <Col><Button type="text" onClick={fullHeight} icon={<ColumnHeightOutlined /> }/></Col>
                <Col><Button type="text" disabled={actives.length <= 0} onClick={deleteAll} icon={<DeleteOutlined /> }/></Col>
            </Row>
        </>
    )
}

export default ToolBar