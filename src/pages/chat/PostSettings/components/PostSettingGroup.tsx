import MyModalWrapper from '@/components/MyModalWrapper';
import HighlightText from '@/components/MyModalWrapper/HighlightText';
import { API } from '@/services/typings';
import { InputNumber, Space, Switch, Typography } from 'antd';
import { valueType } from 'antd/es/statistic/utils';
import useToken from 'antd/es/theme/useToken';
import { InputNumberProps } from 'antd/lib';
import React, { memo, useEffect, useState } from 'react';
import SettingToolTip from './SettingToolTip';
const { Text } = Typography;

interface IPostSettingGroupProps {
	settings: API.PostSetting[];
	onChange(data: Partial<API.PostSetting>): Promise<boolean | undefined>;
	disabled?: boolean;
}

const MoneyConfig: Pick<
	InputNumberProps,
	'formatter' | 'parser' | 'precision'
> = {
	formatter: (value) =>
		`${value || 0}`.replace(/(?<!\..*)\B(?=(\d{3})+(?!\d))/g, ','),
	parser: (value) => value?.replace(/\$\s?|(,*)/g, '') || 0,
	precision: 2,
};

const BanSetting: React.FC<
	{ setting: API.PostSetting } & Omit<IPostSettingGroupProps, 'settings'>
> = ({ setting, onChange, disabled }) => {
	const [inputting, setInputting] = useState(false);
	const [value, setValue] = useState<valueType | null>(null);
	const token = useToken()[1];
	useEffect(() => {
		if (!inputting && value && setting.amount !== value) {
			onChange({ ...setting, amount: value as number });
		}
	}, [value, inputting, onChange, setting]);
	const checked = !!setting.isValidity;
	return (
		<Space style={{ display: 'flex', width: 500 }} size={16} key={setting.id}>
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
						<HighlightText>{setting.speakConfigType}</HighlightText>
						发言配置吗?
					</div>
				}
				onFinish={() => {
					return onChange({ ...setting, isValidity: Number(!checked) });
				}}
			>
				<Switch
					checked={checked as boolean}
					checkedChildren='开'
					unCheckedChildren='关'
					disabled={disabled}
				/>
			</MyModalWrapper>
			<Text style={{ minWidth: 104, display: 'inline-block' }}>
				{setting.speakConfigType}
				<SettingToolTip title={setting.remark} />
			</Text>
			<InputNumber
				style={{ width: 150, backgroundColor: 'rgba(72, 71, 96, 0.1)' }}
				min={0}
				defaultValue={setting.amount}
				{...MoneyConfig}
				onFocus={() => {
					setInputting(true);
				}}
				onChange={(value) => {
					setValue(value);
				}}
				onBlur={() => {
					setInputting(false);
				}}
				disabled={disabled}
			/>
		</Space>
	);
};

const PostSettingGroup: React.FC<IPostSettingGroupProps> = ({
	settings,
	onChange,
	disabled,
}) => {
	return (
		<Space wrap>
			{settings.map((setting) => {
				return (
					<BanSetting
						key={setting.speakConfigType}
						setting={setting}
						onChange={onChange}
						disabled={disabled}
					/>
				);
			})}
		</Space>
	);
};
export default memo(PostSettingGroup);
