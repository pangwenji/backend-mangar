import { useFieldEmptyValue } from '@/utils/commonHooks/fieldEmptyStr';
import { ProFormSelect } from '@ant-design/pro-form';
import type { ProFormSelectProps } from '@ant-design/pro-form/es/components/Select';
import React, { memo } from 'react';

export type MyFormSelectProps = ProFormSelectProps & {
  allowForceClear?: boolean; // true: 当清空时可以不收集该字段 false: 收集字段, 值为空字符串
  emptyValue?: string | number;
};

/* 无选择时返回空字符串 */
const MyFormSelect: React.FC<MyFormSelectProps> = ({
  fieldProps,
  allowForceClear = false,
  emptyValue = '',
  ...props
}) => {
  const { onChange, value } = useFieldEmptyValue({
    fieldProps,
    rules: props.rules,
    name: props.name,
    emptyValue,
    allowForceClear,
  });

  return <ProFormSelect {...props} fieldProps={{ ...fieldProps, onChange: onChange, value }} />;
};

export default memo(MyFormSelect);
