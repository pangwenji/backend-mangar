import { Suspense, useState } from 'react';
import { useRequest } from 'umi';
import IntroduceRow from './components/IntroduceRow';
import MemberCard from './components/MemberCard';
import PageLoading from './components/PageLoading';
import { DashboardDefaultMonth } from './tools';

import MyPageContainer from '@/components/MyPageContainer';
import { getDashboardInfo } from '@/services/api';
import { StatisticsType } from '@/services/enums';
import { API } from '@/services/typings';
import { TimeFormatConsts } from '@/utils/timeFormat';
import { Dayjs } from 'dayjs';
import type { RangeValue } from 'rc-picker/lib/interface';
import type { FC } from 'react';
import './index.less';
import { getDashboardMonthDistance } from './tools';

const getTimeParams = (range: RangeValue<Dayjs>) => {
	return (
		range?.length === 2 && {
			startTime: range[0]?.format(TimeFormatConsts.DateTime),
			endTime: range[1]?.format(TimeFormatConsts.DateTime),
		}
	);
};

const Dashboard: FC = () => {
	const [tabKey, setTabKey] = useState<StatisticsType>(StatisticsType.Register);
	const [monthRange, setMonthRange] = useState<RangeValue<Dayjs>>(
		getDashboardMonthDistance(DashboardDefaultMonth)
	);
	const {
		loading: dataLoading,
		data,
		run: dataChartRun,
	} = useRequest(getDashboardInfo, {
		defaultParams: [
			{
				queryCode: tabKey,
				...getTimeParams(monthRange),
			} as API.DashboardParams,
		],
	});

	const loading = dataLoading;

	// 切换 tab
	const handleTabChange = (key: string) => {
		setTabKey(key as StatisticsType);
		dataChartRun({
			queryCode: key as StatisticsType,
			...getTimeParams(monthRange),
		});
	};

	// 切换 month
	const handleMonthChange = (timeRange: RangeValue<Dayjs>) => {
		setMonthRange(timeRange);
		dataChartRun({
			queryCode: tabKey,
			...getTimeParams(timeRange),
		});
	};

	return (
		<MyPageContainer
			header={{ breadcrumb: undefined }}
			className='dashboard-page'
		>
			<Suspense fallback={<PageLoading />}>
				<IntroduceRow loading={dataLoading} memberData={data} />
			</Suspense>
			<Suspense fallback={<PageLoading />}>
				<MemberCard
					data={data}
					loading={loading}
					onTabChange={handleTabChange}
					onMonthChange={handleMonthChange}
					activeKey={tabKey}
				/>
			</Suspense>
		</MyPageContainer>
	);
};

export default Dashboard;
