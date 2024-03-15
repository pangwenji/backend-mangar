import { memo } from 'react';
import MyDigitInput from '../MyDigitInput';

import type { ProFormDigitProps } from '@ant-design/pro-form/lib/components/Digit';

const MySortInput: React.FC<ProFormDigitProps> = ({ fieldProps, ...props }) => {
  const minValue = typeof props.min === 'number' ? props.min : 0;
  return (
    <MyDigitInput
      label='排序'
      name='sort'
      initialValue={0}
      rules={[
        { required: true, message: '请输入排序' },
        {
          validator(_, value) {
            if (value !== null && value !== undefined) {
              if (!Number.isNaN(Number(value))) {
                if (value < minValue) {
                  return Promise.reject(new Error(`不得小于: ${minValue}`));
                }
              } else {
                return Promise.reject(new Error(`${value} 不是符合格式的数字`));
              }
            }

            return Promise.resolve();
          },
        },
      ]}
      {...props}
      fieldProps={fieldProps}
    />
  );
};
export default memo(MySortInput);
