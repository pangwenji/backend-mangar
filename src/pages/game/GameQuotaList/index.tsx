import React, { memo } from 'react';

import HandicapWrapper from '../components/HandicapWrapper';
import LotteryNMerchantPageContainer from '../components/LotteryNMerchantPageContainer';
import QuotaList from './components/QuotaList';

const GameQuotaList: React.FC = () => {
	return (
		<LotteryNMerchantPageContainer
			tabRender={(props) => {
				return (
					!!(props.lotteryCode && props.merchantId) && (
						<HandicapWrapper
							{...props}
							renderContent={(handicapCode) => {
								return (
									<QuotaList
										lotteryCode={props.lotteryCode}
										merchantId={props.merchantId}
										handicapCode={handicapCode}
										key={handicapCode || 'DEFAULT'}
									/>
								);
							}}
						/>
					)
				);
			}}
		></LotteryNMerchantPageContainer>
	);
};
export default memo(GameQuotaList);
