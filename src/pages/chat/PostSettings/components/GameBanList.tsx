import React, { useCallback, useEffect, useState } from 'react';

import SettingCardWrapper from '@/components/SettingCardWrapper';
import { queryGameBanList, updateGameBan } from '@/services/api';
import type { API } from '@/services/typings';
import { useAccess } from '@umijs/max';
import { Card, message } from 'antd';
import GameBanGroup from './GameBanGroup';
import SettingToolTip from './SettingToolTip';

const GameBanList: React.FC = () => {
	const access = useAccess();
	const [banList, setBanList] = useState<API.GameBanItem[]>([]);

	const refreshData = useCallback(() => {
		queryGameBanList()
			.then(setBanList)
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (access.CHAT_MANAGEMENT_SPEAK_GAME_BAN_LIST) {
			refreshData();
		}
	}, [access.CHAT_MANAGEMENT_SPEAK_GAME_BAN_LIST]);

	/** 编辑窗口的弹窗 */
	const handleOnChange = useCallback(
		async (data: API.GameBanEditItem) => {
			try {
				await updateGameBan(data);
				refreshData();
				message.success('更新配置成功');
				return true;
			} catch {
				message.success('更新配置失败');
			}
			return true;
		},
		[refreshData]
	);
	const diabled = !access.CHAT_MANAGEMENT_SPEAK_GAME_BAN_UPDATE;
	return (
		access.CHAT_MANAGEMENT_SPEAK_GAME_BAN_LIST && (
			<SettingCardWrapper loading={!banList}>
				<Card
					bordered={false}
					title={
						<>
							游戏禁言配置
							<SettingToolTip title='配置关闭禁止會員在此游戏發言' />
						</>
					}
					bodyStyle={{ paddingInline: 0 }}
				>
					<GameBanGroup
						disabled={diabled}
						onChange={handleOnChange}
						settings={banList}
					/>
				</Card>
			</SettingCardWrapper>
		)
	);
};

export default GameBanList;
