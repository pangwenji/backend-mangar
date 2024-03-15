import { Popconfirm } from 'antd';
import React, { useState } from 'react';

import type { PopconfirmProps } from 'antd';

import './index.less';

const MyPopconfirm: React.FC<PopconfirmProps> = ({
  onConfirm,
  onCancel,
  okButtonProps,
  children,
  open: controlledVisible,
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = () => {
    setVisible(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    if (onConfirm) {
      await onConfirm();
    }
    setConfirmLoading(false);
    setVisible(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setVisible(false);
  };

  return (
    <Popconfirm
      overlayClassName='my-popconfirm'
      placement='topLeft'
      {...props}
      okButtonProps={{ ...okButtonProps, loading: confirmLoading }}
      open={
        (typeof controlledVisible === 'undefined' || controlledVisible) &&
        visible
      }
      onConfirm={handleOk}
      onCancel={handleCancel}
    >
      <div onClick={props?.disabled ? undefined : showPopconfirm}>
        {children}
      </div>
    </Popconfirm>
  );
};

export default MyPopconfirm;
