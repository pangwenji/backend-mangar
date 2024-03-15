import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput, { TrimmedTextArea } from '@/components/TrimmedInput';
import React from 'react';

import MyUpload from '@/components/MyUpload';
import { type ModalFormProps } from '@ant-design/pro-components';

const EditGameTypeForm: React.FC<ModalFormProps<any>> = ({ ...props }) => {
  const { initialValues, ...restProps } = props;
  const isEdit = !!initialValues;
  const title = isEdit ? '编辑游戏类型' : '新增游戏类型';
  return (
    <AutoResetModalForm
      title={title}
      initialValues={initialValues}
      colProps={{ span: 24 }}
      {...restProps}
    >
      <TrimmedInput
        name='gameTypeName'
        label='类型名称'
        rules={[{ required: true }]}
      />
      <TrimmedTextArea name='remark' label='类型介绍' />
      <MyUpload name='iconUrl' label='图标' />
    </AutoResetModalForm>
  );
};

export default EditGameTypeForm;
