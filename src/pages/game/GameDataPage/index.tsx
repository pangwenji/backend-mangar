import { useAccess } from '@umijs/max';
import React from 'react';

import MyPageContainer from '@/components/MyPageContainer';
import GameList from './components/GameList';
import GamePlayTypeList from './components/GamePlayTypeList';
import GameTypeList from './components/GameTypeList';
import OpenTimeList from './components/OpenTimeList';

import type { PageHeaderTabConfig } from '@ant-design/pro-layout/es/components/PageContainer';

const GameDataPage: React.FC = () => {
	const access = useAccess();

	return (
		<MyPageContainer
			tabList={
				[
					access.GAME_MANAGEMENT_DATA_01 && {
						tab: '分类管理',
						key: 'type',
						children: <GameTypeList />,
					},
					access.GAME_MANAGEMENT_DATA_03 && {
						tab: '游戏管理',
						key: 'game',
						children: <GameList />,
					},
					access.GAME_MANAGEMENT_DATA_PLAY_TYPE_LIST && {
						tab: '玩法管理',
						key: 'playType',
						children: <GamePlayTypeList />,
					},
					access.GAME_MANAGEMENT_DATA_TIME_LIST && {
						tab: '开盘时间',
						key: 'time',
						children: <OpenTimeList />,
					},
				].filter(Boolean) as PageHeaderTabConfig['tabList']
			}
		></MyPageContainer>
	);
};

export default GameDataPage;
