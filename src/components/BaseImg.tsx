import { Image} from "antd";

const BaseImg: React.FC<any> = (props: any) => {
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
          preview={true}
        /> */}
      </div>
  )
}

BaseImg.defaultProps = {
  style: {
    width: 150,
    height: 150 
  }
}

export default BaseImg;
