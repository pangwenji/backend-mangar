import MyPageContainer from '@/components/MyPageContainer';
import React from 'react';
import OperateLogList from './components/OperateLogList';

// 后台管理员-mgt,前台玩家-client
const OperateLogPage: React.FC = () => {
  return (
    <MyPageContainer
    /* tabList={[
        {
          tab: '管理员',
          key: LoginUserType.MGT,
          children: <OperateLogList platform={LoginUserType.MGT} />,
        },
        {
          tab: '会员',
          key: LoginUserType.Client,
          children: <OperateLogList platform={LoginUserType.Client} />,
        },
      ]} */
    >
      <OperateLogList />
    </MyPageContainer>
  );
};

export default OperateLogPage;
