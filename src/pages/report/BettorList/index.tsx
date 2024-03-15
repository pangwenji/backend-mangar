import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { queryBettorList } from '@/services/api';

import { createMoneyCols } from '@/utils/tableCols';

import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import type { API } from '@/services/typings';
import { createMerchantCodeCol } from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { createReportQuickSelectTimeCol } from '../../../components/MyDateTimePicker/ReportQuickTimeSearch';
import BettorSummaryRow from './components/BettorSummaryRow';

const SearchColWL = ['userName'];

const BettorList: React.FC = () => {
	const access = useAccess();
	const actionRef = useRef<ActionType>();
	const [summaryInfo, setSummaryInfo] = useState<API.BettorSummary>();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const [currentRow, setCurrentRow] = useState<API.BettorItem>();

	const columns: ProColumns<API.BettorItem>[] = (
		[
			createReportQuickSelectTimeCol(),
			createMerchantCodeCol({
				title: '渠道名称',
				// initialValue: TempMerchantCode,
				// fieldProps: { allowClear: false },
			}),
			{
				title: '会员账号',
				dataIndex: 'userName',
				fixed: 'left',
				width: 140,
				render: (dom, entity) => {
					return (
						<a
							onClick={() => {
								setCurrentRow(entity);
								setShowDetail(true);
							}}
						>
							{dom}
						</a>
					);
				},
			},
			{
				title: '游戏名称',
				dataIndex: 'gameName',
			},
			...createMoneyCols([
				{
					title: '投注金额',
					dataIndex: 'betAmount',
					tooltip: '(单游戏/用户汇总)',
				},
				{
					title: '有效投注',
					dataIndex: 'validAmount',
					tooltip: '(单游戏/用户汇总)',
				},
				{
					title: '派彩金额',
					dataIndex: 'rewardAmount',
					tooltip: '(单游戏/用户汇总)',
				},
			]),
			{
				title: '投注笔数',
				dataIndex: 'count',
			},
			{
				title: '盈利笔数',
				dataIndex: 'winCount',
			},
			{
				title: '亏损笔数',
				dataIndex: 'lossCount',
			},
			...createMoneyCols([
				{
					title: '会员输赢',
					dataIndex: 'memberWinLoss',
				},
				{
					title: '公司盈亏',
					dataIndex: 'companyWinLoss',
					tooltip: '(单游戏/用户汇总)',
				},
			]),
			{
				title: '会员胜率',
				dataIndex: 'memberWinPercent',
			},
		] as ProColumns<API.BettorItem>[]
	).map((col) => {
		return {
			hideInSearch:
				!col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
			...col,
		};
	});

	return (
		access.REPORT_MANAGEMENT_MEMBER_01 && (
			<MyPageContainer>
				<MyTable<API.BettorItem, TableListPagination>
					actionRef={actionRef}
					rowKey={(row) => {
						return row.userName + row.gameName;
					}}
					scroll={{ x: 1800 }}
					request={async (params, ...rest) => {
						const data = await queryBettorList(params, ...rest);
						setSummaryInfo(data.sumInfo);
						return data;
					}}
					columns={columns}
					rowSelection={false}
					summary={(pageData) => {
						const totalData = pageData.reduce(
							(res, item) => {
								res.totalBetAmount += item.betAmount;
								res.totalValidAmount += item.validAmount;
								res.totalRewardAmount += item.rewardAmount;
								res.totalCount += item.count;
								res.totalWinCount += item.winCount;
								res.totalLossCount += item.lossCount;
								res.totalMemberWinLoss += item.memberWinLoss;
								res.totalCompanyWinLoss += item.companyWinLoss;
								return res;
							},
							{
								totalBetAmount: 0,
								totalValidAmount: 0,
								totalRewardAmount: 0,
								totalCount: 0,
								totalWinCount: 0,
								totalLossCount: 0,
								totalMemberWinLoss: 0,
								totalCompanyWinLoss: 0,
							}
						);
						return (
							<ProTable.Summary>
								<BettorSummaryRow
									title='小计'
									betAmount={totalData.totalBetAmount}
									validAmount={totalData.totalValidAmount}
									rewardAmount={totalData.totalRewardAmount}
									count={totalData.totalCount}
									winCount={totalData.totalWinCount}
									lossCount={totalData.totalLossCount}
									memberWinLoss={totalData.totalMemberWinLoss}
									companyWinLoss={totalData.totalCompanyWinLoss}
								/>
								<BettorSummaryRow
									title='合计'
									betAmount={summaryInfo?.sumBetAmount}
									validAmount={summaryInfo?.sumValidAmount}
									rewardAmount={summaryInfo?.sumRewardAmount}
									count={summaryInfo?.sumCount}
									winCount={summaryInfo?.sumWinCount}
									lossCount={summaryInfo?.sumLossCount}
									memberWinLoss={summaryInfo?.sumMemberWinLoss}
									companyWinLoss={summaryInfo?.sumCompanyWinLoss}
								/>
							</ProTable.Summary>
						);
					}}
				/>
				<Drawer
					width={600}
					open={showDetail}
					onClose={() => {
						setCurrentRow(undefined);
						setShowDetail(false);
					}}
					closable={false}
				>
					{currentRow?.userName && (
						<ProDescriptions<API.BettorItem>
							column={2}
							title={currentRow?.userName}
							dataSource={currentRow}
							columns={columns as ProDescriptionsItemProps<API.BettorItem>[]}
						/>
					)}
				</Drawer>
			</MyPageContainer>
		)
	);
};

export default BettorList;
