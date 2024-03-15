import { useFieldEmptyValue } from '@/utils/commonHooks/fieldEmptyStr';
import { ProFormDateTimePicker } from '@ant-design/pro-components';
import dayjs, { Dayjs } from 'dayjs';
import React, { memo, useEffect } from 'react';

import type { ProFormFieldItemProps } from '@ant-design/pro-form/es/typing';
import { DatePickerProps, Form } from 'antd';

type MyDateTypePickerProps = ProFormFieldItemProps<DatePickerProps>;

const formatMoment = (time: Dayjs | Date | string | null) => {
  // console.log('formatMoment => ', time);
  if (time) {
    return Math.trunc(dayjs(time).toDate().getTime() / 1000);
  } else {
    return 0;
  }
};

/* 
 timestamp second
*/
const MyDateTimePicker: React.FC<MyDateTypePickerProps> = ({ fieldProps, ...props }) => {
  const formInstance = Form.useFormInstance();
  const emptyProps = useFieldEmptyValue<DatePickerProps>({
    ...props,
    emptyValue: 0,
  });
  useEffect(() => {
    if (props.name) {
      const value = formInstance.getFieldValue(props.name);
      if (!value) {
        formInstance.setFieldValue(props.name, null);
      }
    }
  }, [formInstance, props.name]);
  return (
    <ProFormDateTimePicker
      {...props}
      fieldProps={{
        ...fieldProps,
        ...emptyProps,
      }}
      transform={
        props.name
          ? (value) => {
              return {
                [props.name as string]: formatMoment(value),
              };
            }
          : undefined
      }
    />
  );
};

export default memo(MyDateTimePicker);
