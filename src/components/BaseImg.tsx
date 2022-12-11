import { BaseEditorProps } from '../types/types';
// import { Image } from "antd";
import { splitByKeys } from '../core/utils'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

type BaseImgProps = BaseEditorProps;


const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
const BaseImg: React.FC<BaseImgProps> = (props: any) => {
  const [htmlProps] = splitByKeys(props, ['keepRatio'])
  const { url } = props
  let groundUrl;
  if(url && (url !== '$LOADING$')){
    groundUrl = `url(${props.url})`
  }

  console.info(url, groundUrl, props)

  return (
      <div
        {...htmlProps}
        tabIndex={-1}
        style={{
          backgroundImage: groundUrl, 
          backgroundColor: groundUrl ? undefined : '#DEDEDE', 
          backgroundSize: "cover", 
          ...htmlProps.style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {
          url === '$LOADING$' ? (<Spin indicator={antIcon} />) : null
        }
      </div>
  )
}

BaseImg.defaultProps = {
  size: [150, 150],
  keepRatio: true
}

export default BaseImg;
