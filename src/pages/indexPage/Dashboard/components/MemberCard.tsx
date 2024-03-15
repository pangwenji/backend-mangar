// import { Line } from '@ant-design/charts';
import { BaseTextColor } from '@/../config/theme';
import MyDropdown from '@/components/MyDropdown';
import { StatisticsType } from '@/services/enums';
import { API } from '@/services/typings';
import { Column, ColumnConfig } from '@ant-design/plots';
import { Badge, Card, TabPaneProps, Tabs, Typography } from 'antd';
import { TabsProps } from 'antd/lib';
import { Dayjs } from 'dayjs';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import type { RangeValue } from 'rc-picker/lib/interface';
import type { Tab } from 'rc-tabs/lib/interface';
import React, { memo, useState } from 'react';
import {
	DashboardDefaultMonth,
	getDashboardMonthDistance,
	MonthMenuItems,
} from '../tools';

const { Title } = Typography;

interface MonthSelecterProps {
	onMonthChange(data: RangeValue<Dayjs>): void;
}
const MonthSelecter: React.FC<MonthSelecterProps> = ({ onMonthChange }) => {
	const [selectedMonth, setSelectedMonth] = useState(DashboardDefaultMonth);
	const handleMenuClick: MenuClickEventHandler = (info) => {
		const numMonth = Number(info.key);
		setSelectedMonth(numMonth);
		onMonthChange(getDashboardMonthDistance(numMonth));
	};
	return (
		<MyDropdown
			menu={{
				items: MonthMenuItems,
				selectedKeys: [`${selectedMonth}`],
				onClick: handleMenuClick,
			}}
			spaceProps={{ size: 13 }}
		>
			<Title level={5}>{selectedMonth}月</Title>
		</MyDropdown>
	);
};

const TabConfigs: (TabPaneProps & React.Attributes)[] = [
	{
		tab: '每日新增',
		key: StatisticsType.Register,
	},
	{
		tab: '登录人数',
		key: StatisticsType.Login,
	},
	{
		tab: '游戏人数',
		key: StatisticsType.Bet,
	},
];

interface IUserCardProps {
	data?: API.DashboardInfo;
	loading: boolean;
	onTabChange: TabsProps['onChange'];

	activeKey: StatisticsType;
}

type ChartData = Pick<API.DashboardMonthData, 'num'> & {
	_type: string;
	day: string;
};
const XYLabel = {
	style: {
		fill: BaseTextColor,
		fontSize: 12,
	},
};
const ChartConfig: Omit<ColumnConfig, 'data'> = {
	autoFit: true,
	xField: 'day',
	yField: 'num',
	seriesField: '_type',
	height: 348,
	minColumnWidth: 6,
	maxColumnWidth: 6,
	legend: false,
	yAxis: {
		grid: {
			// @ts-ignore
			line: null,
		},
		label: XYLabel,
	},
	xAxis: {
		// line: null,
		label: XYLabel,
	},
	tooltip: {
		showTitle: false,
		position: 'top',
		domStyles: {
			'g2-tooltip': {
				height: 33,
				padding: '6px 15px 7px 11.9px',
				borderRadius: '17.2px',
			},
		},
		customContent(_, data) {
			return <Badge color='rgb(45, 183, 245)' text={data?.[0]?.value} />;
		},
	},
	columnStyle: {
		fill: 'l(270) 0:#2892f4 1:#66c3f8',
		radius: [10, 10, 0, 0],
	},
};

// 生成 _type 数组供折线图使用
const createCharArr = (
	sourceArr: API.DashboardMonthData[] | null,
	typeKey: string
) => {
	const sArr = sourceArr || [];
	const result = sArr.map((item) => {
		return {
			_type: typeKey,
			...item,
		} as ChartData;
	});
	if (
		result.length &&
		new Date(result[0].day).getMonth() !==
			new Date(result[result.length - 1].day).getMonth()
	) {
		result.pop();
	}
	return result;
};

const MemberCard: React.FC<IUserCardProps & MonthSelecterProps> = ({
	loading,
	data,
	onTabChange,
	onMonthChange,
	activeKey,
}) => {
	// 处理图表格式化
	const handleChartDataFormart = (key: string) => {
		let result = [] as ChartData[];
		if (!data) return result;
		if (key === StatisticsType.Register) {
			result = createCharArr(data.monthDataList, '每日注册');
		} else if (key === StatisticsType.Login) {
			result = createCharArr(data.monthDataList, '在线人数');
		} else {
			result = createCharArr(data.monthDataList, '游戏人数');
		}
		return result;
	};

	return (
		<Card
			className='member-card'
			style={{ border: 'none' }}
			bodyStyle={{ padding: 0, height: 470 }}
		>
			<Tabs
				activeKey={activeKey}
				onChange={onTabChange}
				size='large'
				tabBarStyle={{ marginBottom: 30, border: 'none' }}
				animated={false}
				tabBarExtraContent={<MonthSelecter onMonthChange={onMonthChange} />}
				items={TabConfigs.map((tabProps) => {
					const forattedData = handleChartDataFormart(tabProps.key as string);
					const trickNum = 4;
					let maxNum =
						forattedData
							.map((data) => data.num)
							.sort((a, b) => a - b)
							.pop() || 0;

					const remainder = maxNum % trickNum;
					if (remainder > 0) {
						maxNum += trickNum - remainder;
					}
					return {
						key: tabProps.key,
						label: tabProps.tab,
						children: (
							<Column
								loading={loading}
								data={forattedData}
								{...ChartConfig}
								meta={{
									num: {
										alias: tabProps.tab as string,
										ticks: maxNum
											? Array(trickNum + 1)
													.fill(1)
													.map((_, index) => {
														return index * (maxNum / trickNum);
													})
											: [0],
									},
									day: {
										formatter(value) {
											return new Date(value).getDate();
										},
									},
								}}
							/>
						),
					} as Tab;
				})}
			/>
		</Card>
	);
};

export default memo(MemberCard);
