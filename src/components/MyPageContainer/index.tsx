import { PageContainer, PageContainerProps } from '@ant-design/pro-components';
import React, { memo } from 'react';
import './index.less';

const MyPageContainer: React.FC<PageContainerProps> = ({
  children,
  header,
  ...props
}) => {
  return (
    <PageContainer {...props} header={{ title: false, ...header }}>
      {children}
    </PageContainer>
  );
};
export default memo(MyPageContainer);
