import React, { memo } from 'react';

import LotteryPageContainer from '@/components/LotteryPageContainer';
import SettingList from './components/SettingList';
const TemplateSettings: React.FC = (props: any) => {
  return (
    <LotteryPageContainer
      tabRender={(lottery) => <SettingList lotteryCode={lottery.lotteryCode} />}
    />
  );
};
export default memo(TemplateSettings);
