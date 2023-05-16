import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, type UploadProps } from 'antd';
import { type SizeType } from 'antd/lib/config-provider/SizeContext';
import { useEffect, useState } from 'react';
import './UploadAvatar.less';
import { getNameFile } from '@/utils/utils';

const UploadFile = (props: {
  fileList?: any[];
  value?: any;
  onChange?: any;
  maxCount?: number;
  drag?: boolean;
  accept?: string;
  draggerDescription?: string;
  buttonSize?: SizeType;
  otherProps?: UploadProps;
  isAvatar?: boolean;
}) => {
  const { value, onChange, otherProps, drag, buttonSize, draggerDescription, accept, isAvatar } =
    props;
  const limit = props.maxCount || 1;
  const [fileList, setFileList] = useState<any[]>();

  useEffect(() => {
    // Single URL
    if (typeof value === 'string') setFileList([{ url: value, name: getNameFile(value) }]);
    // Array of URLs
    else if (Array.isArray(value))
      setFileList(value.map((url) => ({ url, name: getNameFile(url) })));
    // Object of antd file upload
    else setFileList(props.fileList || (value && value.fileList) || []);
  }, [value, props.fileList]);

  const handleChange = (val: any) => {
    const fil = val.fileList;
    const findLargeFile = fil?.find((file: any) => file.size / 1024 / 1024 > 25);
    const findWrongTypeFile = fil?.find((file: any) => {
      const arrFileName = file.name.split('.');
      return (
        file?.remote !== true &&
        !otherProps?.accept?.includes(arrFileName?.[arrFileName.length - 1])
      );
    });

    if (findLargeFile) {
      message.error('Tập tin phải nhỏ hơn 25MB!');
      return;
    }
    if (findWrongTypeFile && otherProps?.accept) {
      message.error(`Chỉ được chọn các định dạng file sau ${otherProps.accept}`);
      return;
    }

    if (fil.length > limit) fil.splice(0, fil.length - limit);
    setFileList(fil);
    if (onChange) onChange({ fileList: fil });
  };

  // DRAGGER
  if (drag)
    return (
      <Upload.Dragger
        customRequest={({ onSuccess }) => {
          setTimeout(() => onSuccess && onSuccess('ok'), 0);
        }}
        fileList={fileList}
        onChange={handleChange}
        style={{ width: '100%' }}
        multiple={limit > 1}
        accept={accept}
        {...otherProps}
      >
        {!otherProps || !otherProps.disabled ? (
          <>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Nhấn chuột hoặc kéo thả tài liệu để tải lên</p>
            <p className="ant-upload-hint">{draggerDescription}</p>
          </>
        ) : null}
      </Upload.Dragger>
    );
  else if (isAvatar)
    return (
      <Upload
        customRequest={({ onSuccess }) => {
          setTimeout(() => onSuccess && onSuccess('ok'), 0);
        }}
        listType="picture-card"
        className="avatar-uploader"
        fileList={fileList}
        onChange={handleChange}
        style={{ width: '100%' }}
        multiple={false}
        accept="image/*"
        {...otherProps}
      >
        {(!otherProps || !otherProps.disabled) && !fileList?.length ? (
          <div
            style={{
              width: '140px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <PlusOutlined />
            <div className="ant-upload-text">Thêm ảnh đại diện</div>
          </div>
        ) : null}
      </Upload>
    );

  // UPLOAD BUTTON
  return (
    <Upload
      customRequest={({ onSuccess }) => {
        setTimeout(() => onSuccess && onSuccess('ok'), 0);
      }}
      fileList={fileList}
      onChange={handleChange}
      style={{ width: '100%' }}
      multiple={limit > 1}
      accept={accept}
      {...otherProps}
    >
      {!otherProps || !otherProps.disabled ? (
        <Button size={buttonSize || 'small'} icon={<UploadOutlined />}>
          Chọn tệp
        </Button>
      ) : null}
    </Upload>
  );
};

export default UploadFile;
