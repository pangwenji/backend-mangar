import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput from '@/components/TrimmedInput';
import React from 'react';

import type { API } from '@/services/typings';
import { type ModalFormProps } from '@ant-design/pro-components';

const EditCustomServiceForm: React.FC<
  ModalFormProps<API.CustomServiceEditItem>
> = (props) => {
  const { initialValues, ...restProps } = props;
  return (
    <AutoResetModalForm
      title='编辑'
      initialValues={initialValues}
      width={460}
      labelCol={{ span: 4 }}
      {...restProps}
    >
      <TrimmedInput name='account' label='账号' rules={[{ required: true }]} />
    </AutoResetModalForm>
  );
};

export default EditCustomServiceForm;
