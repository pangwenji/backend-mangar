import MyPageContainer from '@/components/MyPageContainer';
import { LoginUserType } from '@/services/enums';
import React from 'react';
import LoginLogList from './components/LoginLogList';

// 后台管理员-mgt,前台玩家-client
const LoginLogPage: React.FC = () => {
  return (
    <MyPageContainer
      tabList={[
        {
          tab: '管理员',
          key: LoginUserType.MGT,
          children: <LoginLogList platform={LoginUserType.MGT} />,
        },
        {
          tab: '会员',
          key: LoginUserType.Client,
          children: <LoginLogList platform={LoginUserType.Client} />,
        },
      ]}
    ></MyPageContainer>
  );
};

export default LoginLogPage;
