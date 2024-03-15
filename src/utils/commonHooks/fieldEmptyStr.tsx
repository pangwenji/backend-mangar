import type { ProFormItemProps } from '@ant-design/pro-form';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useCallback, useState } from 'react';

type EmptyValueParams = ProFormItemProps & {
  allowForceClear?: boolean; // true: 当清空时可以不收集该字段 false: 收集字段, 值为空字符串
  emptyValue?: any;
};

export const useFieldEmptyValue = <T extends { onChange?: (...args: any[]) => void }>({
  fieldProps,
  rules,
  name,
  allowForceClear = false,
  emptyValue = '',
}: EmptyValueParams) => {
  const [value, setValue] = useState();
  const formInstance = useFormInstance();
  const isRequered = rules?.some((rule) => typeof rule === 'object' && rule.required);
  const onChange = fieldProps?.onChange;

  const handleOnChange: T['onChange'] = useCallback(
    (val: any, ...params: any[]) => {
      if (!isRequered && !allowForceClear && name && (val === undefined || val === null)) {
        formInstance?.setFieldsValue({
          [name as string]: emptyValue,
        });
      }
      setValue(val);
      onChange?.(val, ...params);
    },
    [formInstance, allowForceClear, isRequered, name, onChange, emptyValue],
  );

  return {
    onChange: handleOnChange,
    value,
  };
};
