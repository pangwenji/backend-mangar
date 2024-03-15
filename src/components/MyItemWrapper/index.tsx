import {
  ProFormBaseGroupProps,
  ProFormGroup,
} from '@ant-design/pro-components';
import React, { memo } from 'react';

const MyItemWrapper: React.FC<ProFormBaseGroupProps> = ({
  children,
  ...props
}) => {
  return (
    <ProFormGroup colProps={{ span: 24 }} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        // 这里我们通常还会判断 child 的类型来确定是不是要传递相应的数据，这里我就不做了
        const childProps = {
          colProps: { flex: 1 },
          ...child.props,
        };
        return React.cloneElement(child, childProps);
      })}
    </ProFormGroup>
  );
};
export default memo(MyItemWrapper);
