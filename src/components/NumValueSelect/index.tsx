import type { SearchConvertKeyFn, SearchTransformKeyFn } from '@ant-design/pro-components';
import React, { memo } from 'react';
import type { MyFormSelectProps } from '../MyFormSelect';
import MyFormSelect from '../MyFormSelect';

const handleConverValue: SearchConvertKeyFn = (value) => {
  if (typeof value === 'number') {
    return `${value}`;
  }

  return Array.isArray(value) ? value.map(String) : value;
};

const handleTransform: SearchTransformKeyFn = (value, key) => ({
  [key]: Array.isArray(value) ? value.map(Number) : Number(value),
});

const NumValueSelect: React.FC<MyFormSelectProps> = (props) => {
  return (
    <MyFormSelect
      {...props}
      convertValue={props.valueEnum && handleConverValue}
      transform={handleTransform}
    />
  );
};

export default memo(NumValueSelect);
