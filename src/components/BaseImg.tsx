import { BaseEditorProps } from '../types/types';
// import { Image } from "antd";
import { splitByKeys } from '../core/utils'
type BaseImgProps = BaseEditorProps;

const BaseImg: React.FC<BaseImgProps> = (props: any) => {
  const [htmlProps] = splitByKeys(props, ['keepRatio'])
  const groundUrl = props.url && `url(${props.url})`
  return (
      <div
        {...htmlProps}
        tabIndex={-1}
        style={{backgroundImage: groundUrl, backgroundColor: props.url ? undefined : '#DEDEDE', backgroundSize: "cover", ...htmlProps.style}}
      >
      </div>
  )
}

BaseImg.defaultProps = {
  size: [150, 150],
  keepRatio: true
}

export default BaseImg;
