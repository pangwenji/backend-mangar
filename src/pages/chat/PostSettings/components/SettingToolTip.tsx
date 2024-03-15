import { QuestionCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { TooltipProps } from 'antd/lib';
import React, { memo } from 'react';

const SettingToolTip: React.FC<TooltipProps> = (props) => {
	return (
		<Tooltip {...props}>
			<QuestionCircleFilled
				style={{ marginLeft: '0.25em', color: 'rgba(72, 71, 96, 0.5)' }}
			/>
		</Tooltip>
	);
};
export default memo(SettingToolTip);
