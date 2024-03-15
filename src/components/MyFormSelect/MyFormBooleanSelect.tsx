import React, { memo } from 'react';
import MyFormSelect, { MyFormSelectProps } from '.';

const options = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

const MyFormBooleanSelect: React.FC<MyFormSelectProps> = (props) => {
  // @ts-ignore
  return <MyFormSelect options={options} {...props} />;
};

export default memo(MyFormBooleanSelect);
