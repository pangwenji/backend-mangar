import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput from '@/components/TrimmedInput';
import React from 'react';

import { API } from '@/services/typings';
import { type ModalFormProps } from '@ant-design/pro-components';

export const EditPWDModal: React.FC<
  ModalFormProps<API.UpdateCurrentAdminPWDParams>
> = (props) => {
  return (
    <AutoResetModalForm
      title='修改登录密码'
      layout='horizontal'
      labelAlign='left'
      {...props}
    >
      <TrimmedInput.Password
        name='oldPwd'
        label='原密码'
        rules={[
          {
            required: true,
          },
        ]}
      />
      <TrimmedInput.Password
        name='newPwd'
        label='新密码'
        rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('oldPwd') !== value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('请输入不同的密码'));
            },
          }),
        ]}
      />
    </AutoResetModalForm>
  );
};

export const ConfirmLogoutModal: React.FC<ModalFormProps> = (props) => {
  return (
    <AutoResetModalForm title='退出登录' width={380} {...props}>
      <span style={{ marginTop: 20, marginBottom: 40 }}>
        您确定要退出登录吗？
      </span>
    </AutoResetModalForm>
  );
};
