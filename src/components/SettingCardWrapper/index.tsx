import { ConfigProvider } from 'antd';
import type { PropsWithChildren } from 'react';
import React, { memo } from 'react';

import { CustomCommonBG } from '@/../config/theme';
import { ProCard, ProCardProps } from '@ant-design/pro-components';

const SettingCardWrapper: React.FC<PropsWithChildren<ProCardProps>> = ({
  children,
  ...props
}) => {
  return (
    <ProCard
      direction='column'
      gutter={0}
      style={{ marginBlockStart: 8 }}
      bodyStyle={{
        borderRadius: 8,
        padding: 0,
        overflow: 'hidden',
        border: '1px solid rgba(72, 71, 96, 0.1)',
      }}
      {...props}
    >
      <ConfigProvider
        theme={{
          components: {
            Card: {
              headerBg: CustomCommonBG,
              headerHeight: 54,
              borderRadiusLG: 0,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ProCard>
  );
};

export default memo(SettingCardWrapper);
