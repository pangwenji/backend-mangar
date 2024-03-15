import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput from '@/components/TrimmedInput';
import React from 'react';

import type { API } from '@/services/typings';
import { type ModalFormProps } from '@ant-design/pro-components';

const SplitReg = /\s*[,，]\s*/;
const getNumList = (value: string) => {
  return value
    ?.split(SplitReg)
    .map((num) => num.trim())
    .filter(Boolean)
    .map(Number);
};
const formatResult = (value: string) => {
  return getNumList(value).join(',');
};

const EditTestForm: React.FC<ModalFormProps<API.TestEditItem>> = (props) => {
  const { initialValues, ...restProps } = props;
  return (
    <AutoResetModalForm
      title={initialValues?.lotteryName}
      initialValues={{
        ...initialValues,
        drawResult: initialValues?.drawingResult,
      }}
      width={460}
      labelCol={{ span: 6 }}
      {...restProps}
    >
      <TrimmedInput
        name='drawResult'
        label='开奖结果'
        rules={[
          { required: true },
          {
            validator(_, value) {
              const numberList = getNumList(value);
              if (
                numberList?.length &&
                numberList.some((num) => Number.isNaN(num))
              ) {
                return Promise.reject('请输入正确的开奖结果');
              }
              return Promise.resolve();
            },
          },
        ]}
        tooltip='请用,分割数字'
        placeholder='请用,分割数字'
        transform={(value: string, name) => {
          return {
            [name]: formatResult(value),
          };
        }}
      />
    </AutoResetModalForm>
  );
};

export default EditTestForm;
