import React, { useCallback, useEffect, useState } from 'react';

import SettingCardWrapper from '@/components/SettingCardWrapper';
import { queryPostSettings, updatePostSetting } from '@/services/api';
import type { API } from '@/services/typings';
import { useAccess } from '@umijs/max';
import { Card, message } from 'antd';
import PostSettingGroup from './PostSettingGroup';
import SettingToolTip from './SettingToolTip';

const TooltipContent = () => {
	return (
		<div>
			<div>1. 開關都關閉：聊天室發言無門檻限制；</div>
			<div>2. 開啟之一：開啟那個需要滿足那個條件方可發言；</div>
			<div>3. 同時開啟：滿足其中之一的條件均可發言；</div>
		</div>
	);
};

const PostSettingList: React.FC = () => {
	const access = useAccess();
	const [settingList, setSettingList] = useState<API.PostSetting[]>([]);

	const refreshData = useCallback(() => {
		queryPostSettings()
			.then(setSettingList)
			.catch(() => {});
	}, []);

	useEffect(() => {
		if (access.CHAT_MANAGEMENT_SPEAK_CONFIG_LIST) {
			refreshData();
		}
	}, [access.CHAT_MANAGEMENT_SPEAK_CONFIG_LIST]);

	/** 编辑窗口的弹窗 */
	const handleOnChange = useCallback(
		async (data: API.PostSettingEdit) => {
			try {
				await updatePostSetting(data);
				refreshData();
				message.success('更新发言配置成功');
				return true;
			} catch {
				message.success('更新发言配置失败');
			}
		},
		[refreshData]
	);
	const diabled = !access.CHAT_MANAGEMENT_SPEAK_CONFIG_UPDATE;
	return (
		access.CHAT_MANAGEMENT_SPEAK_CONFIG_LIST && (
			<SettingCardWrapper loading={!settingList}>
				<Card
					bordered={false}
					title={
						<>
							发言配置
							<SettingToolTip title={<TooltipContent />} />
						</>
					}
				>
					<PostSettingGroup
						disabled={diabled}
						onChange={handleOnChange}
						settings={settingList}
					/>
				</Card>
			</SettingCardWrapper>
		)
	);
};

export default PostSettingList;
