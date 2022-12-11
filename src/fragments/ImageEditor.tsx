import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload, Radio, RadioChangeEvent, Input } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import React, { useState } from "react";
import { BaseEditorProps } from "../types/types";
import { getBase64 } from "../core/utils"

type ImageEditorProps = BaseEditorProps<string>;
type urlType = "net" | "local";

const ImageEditor: React.FC<ImageEditorProps> = (props) => {
  const [radioValue, setRadioValue] = useState<urlType>("net");
  const [inputValue,setInputValue] = useState("");

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return;
    }
    getBase64(file).then(props.onChange)
  };
  
  const onRadioChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  return (
    <>
      <Radio.Group value={radioValue} onChange={onRadioChange} style={{paddingBottom: '10px'}}>
        <Radio value="net">网络图片</Radio>
        <Radio value="local">本地图片</Radio>
      </Radio.Group>
      {radioValue === "net" ? (
        <Input placeholder="请输入图片url，并以回车结束" 
          value={inputValue}
          onChange={onInputChange}
          onPressEnter={() => {props.onChange(inputValue)}} 
        />
      ) : (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
        >
          <div>
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      )}
    </>
  );
};

export default ImageEditor;
