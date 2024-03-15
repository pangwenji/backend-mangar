import { queryHandicappMenu } from '@/services/api';
import { API } from '@/services/typings';
import { Radio } from 'antd';
import React, { memo, useEffect, useState } from 'react';

const HandicapRadio: React.FC<
	{
		onChange: (menuID: string) => void;
		value?: string;
		onInit: (isInit: boolean) => void;
	} & API.LotteryNMerchatParams
> = ({ value, onChange, lotteryCode, merchantId, onInit }) => {
	const [handicapMenuData, setHandicapMenuData] = useState<
		API.HandicapOption[]
	>([]);

	useEffect(() => {
		if (handicapMenuData.length) return;
		queryHandicappMenu({ lotteryCode })
			.then((menu) => {
				onInit(true);
				if (menu.length) {
					setHandicapMenuData(menu);
					const currentHandicap = menu[0].handicapCode;
					onChange(currentHandicap);
				}
			})
			.catch(() => {});
		return () => {};
	}, [onChange, onInit, merchantId, lotteryCode, handicapMenuData]);

	return (
		handicapMenuData?.length > 1 && (
			<Radio.Group
				value={value}
				onChange={(ev) => {
					const merchantID = ev.target.value;
					onChange(merchantID);
				}}
			>
				{handicapMenuData.map((menu) => (
					<Radio.Button key={menu.handicapCode} value={menu.handicapCode}>
						{menu.handicapName}
					</Radio.Button>
				))}
			</Radio.Group>
		)
	);
};
export default memo(HandicapRadio);
