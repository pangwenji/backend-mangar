import { ModalFormProps } from '@ant-design/pro-components';
import React, { memo, PropsWithChildren, useState } from 'react';
import AutoResetModalForm from '../AutoResetModalForm';

const triggerStyle: React.CSSProperties = {
  display: 'inline-block',
};

export type MyModalWrapperProps = PropsWithChildren<
  Omit<ModalFormProps, 'content'> & {
    content: React.ReactNode;
  }
>;

const MyModalWrapper: React.FC<MyModalWrapperProps> = ({
  children,
  content,
  onFinish,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        style={triggerStyle}
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </div>
      <AutoResetModalForm
        title='操作确认'
        width={380}
        modalProps={{
          bodyStyle: { paddingInline: 29, paddingBlock: '20px 35px' },
        }}
        onFinish={async (fields) => {
          try {
            if (await onFinish?.(fields)) {
              setOpen(false);
            }
          } catch {}
        }}
        {...props}
        onOpenChange={setOpen}
        open={open}
      >
        {content}
      </AutoResetModalForm>
    </>
  );
};
export default memo(MyModalWrapper);
