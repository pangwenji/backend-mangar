import MyPageContainer from '@/components/MyPageContainer';
import { LoginUserType } from '@/services/enums';
import React from 'react';
import SystemLogList from './components/SystemLogList';

// 后台管理员-mgt,前台玩家-client
const SystemLogPage: React.FC = () => {
  return (
    <MyPageContainer
      tabList={[
        {
          tab: '管理员',
          key: LoginUserType.MGT,
          children: <SystemLogList platform={LoginUserType.MGT} />,
        },
        {
          tab: '会员',
          key: LoginUserType.Client,
          children: <SystemLogList platform={LoginUserType.Client} />,
        },
      ]}
    ></MyPageContainer>
  );
};

export default SystemLogPage;
