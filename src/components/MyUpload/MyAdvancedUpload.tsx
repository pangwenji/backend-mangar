import {
  ProFormGroup,
  ProFormItem,
  ProFormUploadButtonProps,
} from '@ant-design/pro-components';
import { RcFile } from 'antd/es/upload';
import React, { memo } from 'react';
import MyUpload from '.';

const getImgSizes = (file: RcFile) => {
  return new Promise<[number, number]>((resolve, reject) => {
    if (!file.type.startsWith('image')) {
      reject(new Error('Not Image'));
      return;
    }
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    const objectUrl = _URL.createObjectURL(file);
    img.onerror = reject;
    img.onload = function () {
      resolve([img.width, img.height]);
      _URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
};

const MyAdvancedUpload: React.FC<
  ProFormUploadButtonProps & {
    limitProps?: {
      widthHeight?: string;
      mimetype?: string;
      style?: React.CSSProperties;
    };
    mimeTypes: string[];
  }
> = ({ limitProps, mimeTypes, rules = [], ...props }) => {
  return (
    <ProFormGroup style={{ position: 'relative' }}>
      <MyUpload
        rules={[
          {
            async validator(_, fileList) {
              if (!Array.isArray(fileList) || !fileList.length)
                return Promise.resolve();
              const file = fileList[0];
              // 检查图片格式
              const isValidType = mimeTypes.includes(file.type);
              if (!isValidType && limitProps?.mimetype) {
                return Promise.reject(
                  `${file.name} 不符合格式，请上传 ${limitProps?.mimetype} 格式的图片`
                );
              }
              // 检查图片尺寸

              const imgSizes = limitProps?.widthHeight?.split('*')?.map(Number);
              if (!imgSizes?.length || imgSizes.length !== 2)
                return Promise.resolve();
              try {
                const fileSizes = await getImgSizes(file.originFileObj);
                console.log('fileSize => ', fileSizes);
                if (
                  fileSizes[0] === imgSizes[0] &&
                  fileSizes[1] === imgSizes[1]
                ) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(
                    `当前图片的宽高${fileSizes[0]}*${fileSizes[1]}不符合要求尺寸${limitProps?.widthHeight}`
                  );
                }
              } catch {
                return Promise.reject(`获取当前上传文件的宽高尺寸出错, 请重试`);
              }
            },
          },
          ...rules,
        ]}
        {...props}
      />
      {limitProps && (
        <div
          style={{
            position: 'absolute',
            left: 190,
            top: 'calc(100px - 3em)',
            ...limitProps.style,
          }}
        >
          <ProFormItem
            style={{
              color: 'rgba(72, 71, 96, 0.5)',
              fontSize: 12,
              paddingBottom: 8,
            }}
          >
            {limitProps.widthHeight && `尺寸 ${limitProps.widthHeight}`}
            <br />
            {limitProps.mimetype && `格式 ${limitProps.mimetype}`}
          </ProFormItem>
        </div>
      )}
    </ProFormGroup>
  );
};
export default memo(MyAdvancedUpload);
