import React, { memo, useState } from 'react';

import LotteryPageContainer from '@/components/LotteryPageContainer';
import MerchantCodeRadio from '../components/MerchantCodeRadio';

import { API } from '@/services/typings';
import '../components/index.less';

const LotteryNMerchantPageContainer: React.FC<{
	tabRender(props: API.LotteryNMerchatParams): React.ReactNode;
}> = ({ tabRender }) => {
	const [currentMerchantID, setCurrentMerchantID] = useState<number>();
	return (
		<LotteryPageContainer
			loading={!currentMerchantID}
			breadcrumbRender={(_, defaultDom) => {
				return (
					<div className='merchant-code-breadcrumb-wrapper'>
						<MerchantCodeRadio onChange={setCurrentMerchantID} />
						{defaultDom}
					</div>
				);
			}}
			tabListRender={
				Number.isInteger(currentMerchantID)
					? (lotteryMenu) => {
							return lotteryMenu?.map((menu) => ({
								tab: menu.lotteryName,
								key: menu.lotteryCode + currentMerchantID,
								children: (
									<>
										{tabRender({
											lotteryCode: menu.lotteryCode,
											merchantId: currentMerchantID!,
										})}
									</>
								),
							}));
					  }
					: undefined
			}
		></LotteryPageContainer>
	);
};
export default memo(LotteryNMerchantPageContainer);
