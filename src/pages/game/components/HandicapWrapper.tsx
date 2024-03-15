import { API } from '@/services/typings';
import React, { memo, ReactNode, useState } from 'react';
import HandicapRadio from './HandicapRadio';

const HandicapWrapper: React.FC<
	API.LotteryNMerchatParams & {
		renderContent(handicapCode?: string): ReactNode;
	}
> = ({ renderContent, ...props }) => {
	const [currentHandicapCode, setCurrentHandicapCode] = useState<string>();
	const [handicapInit, setHandicapInit] = useState(false);
	return (
		<>
			<HandicapRadio
				{...props}
				value={currentHandicapCode}
				onChange={setCurrentHandicapCode}
				onInit={setHandicapInit}
			/>
			{handicapInit && renderContent(currentHandicapCode)}
		</>
	);
};
export default memo(HandicapWrapper);
