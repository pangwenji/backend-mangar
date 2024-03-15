import { Button } from 'antd';
import { ButtonProps } from 'antd/lib';
import React, { memo, useState } from 'react';

const GoogleCaptchaButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      loading={loading}
      onClick={
        onClick &&
        (async (...args) => {
          setLoading(true);
          try {
            await onClick(...args);
          } catch {
          } finally {
            setLoading(false);
          }
        })
      }
      {...props}
    >
      {children}
    </Button>
  );
};
export default memo(GoogleCaptchaButton);
