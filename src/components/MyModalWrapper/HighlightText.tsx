import useToken from 'antd/es/theme/useToken';
import React, { memo, PropsWithChildren } from 'react';

const HighlightText: React.FC<PropsWithChildren> = ({ children }) => {
  const token = useToken()[1];
  return (
    <span
      style={{
        color: token.colorTextHeading,
        fontSize: 18,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
};
export default memo(HighlightText);
