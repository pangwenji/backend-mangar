import React, { memo } from 'react';

import LotteryPageContainer from '@/components/LotteryPageContainer';
import { useLocation } from '@umijs/max';
import OrderList from './components/OrderList';
const GameOrderList: React.FC = () => {
  const { state } = useLocation() as {
    state: { periodsNumber: number; lotteryCode: string } | null;
  };
  return (
    <LotteryPageContainer
      tabProps={{
        defaultActiveKey: state?.lotteryCode,
      }}
      tabRender={(lottery) => (
        <OrderList
          lotteryCode={lottery.lotteryCode}
          period={state?.periodsNumber}
        />
      )}
    ></LotteryPageContainer>
  );
};
export default memo(GameOrderList);
