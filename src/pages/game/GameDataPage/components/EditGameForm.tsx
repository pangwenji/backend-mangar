import AutoResetModalForm from '@/components/AutoResetModalForm';
import { TrimmedTextArea } from '@/components/TrimmedInput';
import React from 'react';

import MyUpload from '@/components/MyUpload';
import { queryGameTypeMenu } from '@/services/api';
import type { API } from '@/services/typings';
import { ProFormSelect, type ModalFormProps } from '@ant-design/pro-components';
const ValidIMGTypes = ['image/png'];
const LimitProps = {
  mimetype: 'PNG',
  style: {
    left: 210,
  },
};
const EditGameForm: React.FC<ModalFormProps<API.GameEditItem>> = ({
  ...props
}) => {
  const { initialValues, ...restProps } = props;
  const isEdit = !!initialValues;
  const title = isEdit ? '编辑游戏' : '新增游戏';
  return (
    <AutoResetModalForm
      title={title}
      initialValues={initialValues}
      colProps={{ span: 24 }}
      width={500}
      {...restProps}
    >
      <ProFormSelect
        request={queryGameTypeMenu}
        fieldProps={{
          fieldNames: {
            label: 'gameTypeName',
            value: 'id',
          },
        }}
        name='sysGameTypeId'
        label='游戏类型'
        rules={[{ required: true }]}
        transform={(value) => {
          return {
            gameTypeId: value,
          };
        }}
      />
      <TrimmedTextArea name='remark' label='游戏介绍' />
      <MyUpload name='iconUrl' label='电脑端图标' />
      <MyUpload name='moveIconUrl' label='移动端图标' />
    </AutoResetModalForm>
  );
};

export default EditGameForm;
