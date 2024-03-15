import React, { memo } from 'react';

import { Space, Switch, Typography } from 'antd';
import useToken from 'antd/es/theme/useToken';

import MyModalWrapper from '@/components/MyModalWrapper';
import HighlightText from '@/components/MyModalWrapper/HighlightText';
import { API } from '@/services/typings';
const { Text } = Typography;

interface IGameBanGroupProps {
	settings: API.GameBanItem[];
	onChange(data: API.GameBanEditItem): Promise<boolean | undefined>;
	disabled?: boolean;
}

const BanSetting: React.FC<
	{ setting: API.GameBanItem } & Omit<IGameBanGroupProps, 'settings'>
> = ({ setting, onChange, disabled }) => {
	const token = useToken()[1];

	const checked = !!setting.isSpeakOpen;
	return (
		<Space
			style={{
				display: 'flex',
				marginInline: 16,
				padding: '3px 8px',
				backgroundColor: 'rgba(72, 71, 96, 0.045)',
				borderRadius: 6,
			}}
			size={16}
			key={setting.id}
		>
			<Text style={{ minWidth: '9em', display: 'inline-block' }}>
				{setting.gameName}
			</Text>
			<MyModalWrapper
				content={
					<div>
						确认要
						<span
							style={{ color: checked ? token.colorError : token.colorPrimary }}
						>
							{checked ? '关闭' : '开启'}
						</span>
						<br />
						<HighlightText>{setting.gameName}</HighlightText>
						发言吗?
					</div>
				}
				onFinish={() => {
					return onChange({ id: setting.id, isSpeakOpen: Number(!checked) });
				}}
			>
				<div>
					<Switch
						checked={checked as boolean}
						checkedChildren='开'
						unCheckedChildren='关'
						disabled={disabled}
					/>
				</div>
			</MyModalWrapper>
		</Space>
	);
};

const GameBanGroup: React.FC<IGameBanGroupProps> = ({
	settings,
	onChange,
	disabled,
}) => {
	return (
		<Space wrap>
			{settings.map((setting) => {
				return (
					<BanSetting
						key={setting.gameCode}
						setting={setting}
						onChange={onChange}
						disabled={disabled}
					/>
				);
			})}
		</Space>
	);
};
export default memo(GameBanGroup);
