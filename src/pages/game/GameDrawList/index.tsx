import React, { memo } from 'react';

import LotteryPageContainer from '@/components/LotteryPageContainer';
import DrawList from './components/DrawList';
const GameDrawList: React.FC = () => {
  return (
    <LotteryPageContainer
      tabRender={(lottery) => <DrawList lotteryCode={lottery.lotteryCode} />}
    ></LotteryPageContainer>
  );
};
export default memo(GameDrawList);
