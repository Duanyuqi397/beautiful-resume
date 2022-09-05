import { Button, Image, Upload, UploadProps } from "antd";
import { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import { useState } from "react";
import { Cprops } from "../types/types";

const BaseImg: React.FC<Cprops> = (props: Cprops) => {
  const [picUrl, setPicUrl] = useState<string>("");
  const [preview,setPreview] = useState(false);
  //ToDo:根据props的imgUrl决定用在线图片资源还是本地图片

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setPicUrl(url);
    });
  };

  return (
    <div {...props}>
      {picUrl ? (
        <Image
          style={{ height: "400px", width: "600px" }}
          src={picUrl}
          preview={preview}
          // onDrag={() => setPreview(false)}
          // onDragEnd={() => setPreview(false)}
          //handleDrag的方法会覆盖，导致对preview的设置不生效
        />
      ) : (
        <Upload accept="image/*" onChange={handleChange}>
          <UploadButton />
        </Upload>
      )}
    </div>
  );
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const UploadButton = () => <Button>选择图片</Button>;

export default BaseImg;
