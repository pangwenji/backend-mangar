import React, { memo } from 'react';

import LotteryPageContainer from '@/components/LotteryPageContainer';
import CommandList from './components/CommandList';
import './index.less';

const CommandSettings: React.FC = () => {
	return (
		<LotteryPageContainer
			className='command-settings'
			tabRender={(lottery) => <CommandList lotteryCode={lottery.lotteryCode} />}
		/>
	);
};
export default memo(CommandSettings);
