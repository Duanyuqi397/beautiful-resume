import { BaseEditorProps } from '../types/types';
// import { Image } from "antd";

type BaseImgProps = BaseEditorProps;

const BaseImg: React.FC<BaseImgProps> = (props: any) => {
  const groundUrl = props.url && `url(${props.url})`
  return (
      <div
        {...props}
        tabIndex="-1"
        style={{backgroundImage: groundUrl, backgroundColor: props.url ? undefined : '#DEDEDE', backgroundSize: "cover", ...props.style}}
      >
        {/* <Image
          style={{height: "100%", width: "100%"}}
          src={props.url}
          preview={false}
        /> */}
      </div>
  )
}

BaseImg.defaultProps = {
  style: {
    width: 150,
    height: 150
  },
  drag: {
    keepRatio: true
  }
}

export default BaseImg;
