import type { ModalFormProps } from '@ant-design/pro-components';
import { ModalForm } from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

const ColProps = {
  xs: 24,
  sm: 24,
  md: 24,
};

const AutoResetModalForm: React.FC<ModalFormProps<any>> = (props) => {
  const backupForm = Form.useForm()[0];
  const form = props.form || backupForm;
  const { onOpenChange, children, modalProps, initialValues, submitter,...restProps } =
    props;
  const handleVisibelChange = (visible: boolean) => {
    if (visible && initialValues) {
      form.resetFields();
      form.setFieldsValue(initialValues || {});
    } else {
      form.resetFields();
    }
    onOpenChange?.(visible);
  };
  return (
    <ModalForm
      form={form}
      onOpenChange={handleVisibelChange}
      grid
      size='large'
      colProps={ColProps}
      layout='horizontal'
      labelWrap={true}
      labelCol={{ span: 5 }}
      labelAlign='right'
      colon={false}
      modalProps={{
        destroyOnClose: true,
        ...modalProps,
        maskClosable: false,
      }}
      width={460}
      submitter={{
        searchConfig: { submitText: '确认' },
        render(_, dom) {
          return dom.reverse();
        },
        ...submitter,
      }}
      {...restProps}
    >
      {children}
    </ModalForm>
  );
};

export default AutoResetModalForm;
