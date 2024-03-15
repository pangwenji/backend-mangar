import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput, { TrimmedTextArea } from '@/components/TrimmedInput';
import React from 'react';

import MyAdvancedUpload from '@/components/MyUpload/MyAdvancedUpload';
import type { API } from '@/services/typings';
import { type ModalFormProps } from '@ant-design/pro-components';

const ValidIMGTypes = ['image/png', 'image/jpeg', 'image/webp'];

const EditTextImgForm: React.FC<ModalFormProps<API.TextImgEditItem>> = (
  props
) => {
  const { initialValues, ...restProps } = props;
  const isEdit = !!initialValues;
  const title = isEdit ? '编辑' : '新增';
  const imgSize = (initialValues as API.TextImgItem)?.imgSize || '';

  return (
    <AutoResetModalForm
      title={title}
      initialValues={initialValues}
      width={600}
      labelCol={{ span: 3 }}
      {...restProps}
    >
      <MyAdvancedUpload
        name='fileUrl'
        label='图标'
        limitProps={{
          widthHeight: imgSize,
          mimetype: 'PNG JPG WEB',
        }}
        mimeTypes={ValidIMGTypes}
      />
      <TrimmedInput
        name='hyperLinks'
        label='URL'
        rules={[{ type: 'url', message: '请输入正确的链接地址' }]}
      />
      <TrimmedTextArea name='remark' label='备注' />
    </AutoResetModalForm>
  );
};

export default EditTextImgForm;
