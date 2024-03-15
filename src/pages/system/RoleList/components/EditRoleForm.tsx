import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput, { TrimmedTextArea } from '@/components/TrimmedInput';
import React from 'react';

import MyItemWrapper from '@/components/MyItemWrapper';
import NumValueSelect from '@/components/NumValueSelect';
import { SwitchStatus, SwitchStatusEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import { type ModalFormProps } from '@ant-design/pro-components';

const EditRoleForm: React.FC<ModalFormProps<API.RoleEditItem>> = (props) => {
  const { initialValues, ...restProps } = props;
  const isEdit = !!initialValues;
  const title = isEdit ? '编辑角色' : '新增角色';

  return (
    <AutoResetModalForm
      title={title}
      initialValues={initialValues}
      {...restProps}
    >
      <TrimmedInput name='name' label='角色名称' rules={[{ required: true }]} />
      <NumValueSelect
        name='isValidity'
        label='状态'
        valueEnum={SwitchStatusEnums}
        initialValue={SwitchStatus.Open}
      />
      <TrimmedInput
        name='roleCode'
        label='角色编码'
        rules={[{ required: true }]}
      />
      <MyItemWrapper>
        <TrimmedTextArea name='remark' label='备注' />
      </MyItemWrapper>
    </AutoResetModalForm>
  );
};

export default EditRoleForm;
