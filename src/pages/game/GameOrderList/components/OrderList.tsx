import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Drawer, message, Space, Switch } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';

import {
	queryGameOrderCancelStatus,
	queryGameOrderList,
	queryGameOrderSummary,
	queryHandicappMenu,
	queryPlayTypeMenu,
	querySubPlayTypeMenu,
	switchGameOrderCancel,
} from '@/services/api';

import { createReportQuickSelectTimeCol } from '@/components/MyDateTimePicker/ReportQuickTimeSearch';
import { QuickTimeType } from '@/components/MyDateTimePicker/tools';
import MyModalWrapper from '@/components/MyModalWrapper';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import {
	GameOrderStatus,
	GameOrderStatusEnums,
	GameWinLoseEnums,
	SwitchStatus,
} from '@/services/enums';
import type { API } from '@/services/typings';
import {
	createMoneyCol,
	createMoneyCols,
	createNumberEnumsCol,
	createOnlySearchCol,
	createTimeCol,
} from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import useToken from 'antd/es/theme/useToken';
import { handleGameOrderCancel } from '../actions';
import GameOrderSummaryRow from './GameOrderSummaryRow';

const SearchColWL = [
	'orderStatus',
	'winAndLose',
	'orderDetailNo',
	'userName',
	'periodsNumber',
];

const GameOrderList: React.FC<{ period?: number; lotteryCode: string }> = ({
	period,
	lotteryCode,
}) => {
	const access = useAccess();
	const actionRef = useRef<ActionType>();
	const token = useToken()[1];
	const [summaryInfo, setSummaryInfo] = useState<API.GameOrderSummary>();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const [currentRow, setCurrentRow] = useState<API.GameOrderItem>();
	const [orderCancelStatus, setOrderCancelStatus] = useState<{
		id: number;
		isCancel: SwitchStatus;
	}>();
	const [playTypeCode, setPlayTypeCode] = useState<string>();
	const [isMultiHandicap, setIsMultiHandicap] = useState(false);

	useEffect(() => {
		if (access.GAME_MANAGEMENT_ORDER_CANCEL_SWITCH) {
			queryGameOrderCancelStatus({ lotteryCode })
				.then((data) => {
					setOrderCancelStatus(data.data);
				})
				.catch(() => {});
		}

		queryHandicappMenu({ lotteryCode })
			.then((menu) => {
				if (menu.length) {
					setIsMultiHandicap(true);
				}
			})
			.catch(() => {});
	}, [lotteryCode, access.GAME_MANAGEMENT_ORDER_CANCEL_SWITCH]);

	const handleSwitchOrderCancel = async () => {
		try {
			const updateStatus = {
				...orderCancelStatus!,
				isCancel: Number(!orderCancelStatus!.isCancel),
			};
			await switchGameOrderCancel(updateStatus);
			setOrderCancelStatus(updateStatus);
			return true;
		} catch {}
	};

	const columns: ProColumns<API.GameOrderItem>[] = (
		[
			{
				title: '注单编号',
				dataIndex: 'orderDetailNo',
				fixed: 'left',
				width: 180,
				ellipsis: false,
				span: 2,
				copyable: true,
				render: (dom, entity) => {
					return (
						<a
							style={{ whiteSpace: 'pre-line' }}
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
			createTimeCol({
				title: '投注时间',
				dataIndex: 'orderDate',
				valueType: 'dateTime',
				width: '12em',
			}),
			{
				title: '会员账号',
				dataIndex: 'userName',
			},
			{
				title: '游戏名称',
				dataIndex: 'lotteryName',
			},
			{
				title: '游戏期数',
				dataIndex: 'periodsNumber',
				initialValue: period,
				formItemProps: {
					rules: [
						{
							validator(_, value) {
								const trimmedVal = value?.toString()?.trim();
								if (
									!trimmedVal?.length ||
									(trimmedVal?.length && Number.isInteger(Number(trimmedVal)))
								) {
									return Promise.resolve();
								}
								return Promise.reject('请输入有效游戏期数');
							},
						},
					],
				},
			},
			{
				title: '盘口',
				dataIndex: 'handicapCode',
				span: 2,
				render(dom) {
					if (isMultiHandicap) {
						return dom;
					} else {
						return '默认';
					}
				},
			},
			...createMoneyCols([
				{
					title: '投注金额',
					dataIndex: 'totalAmount',
				},
				{
					title: '有效投注',
					dataIndex: 'validAmount',
				},
			]),
			{
				title: '玩法类型',
				dataIndex: 'playTypeName',
				ellipsis: false,
				width: 200,
			},
			{
				title: '投注内容',
				dataIndex: 'betContent',
			},
			createMoneyCol({
				title: '流水金额',
				dataIndex: 'runningAmount',
			}),
			createTimeCol({
				title: '结算时间',
				dataIndex: 'billTime',
				valueType: 'dateTime',
				width: '12em',
			}),
			{
				title: '赔率',
				dataIndex: 'odds',
			},
			...createMoneyCols([
				{
					title: '返水金额',
					dataIndex: 'returnAmount',
				},
				{
					title: '派彩金额',
					dataIndex: 'rewardAmount',
				},
				{
					title: '会员输赢',
					dataIndex: 'winLoseAmount',
				},
			]),
			createOnlySearchCol({
				title: '分类',
				dataIndex: 'playTypeCode',
				params: { lotteryCode },
				fieldProps: {
					popupMatchSelectWidth: false,
					onChange(value: string | undefined) {
						setPlayTypeCode(value);
					},
					fieldNames: {
						label: 'playTypeName',
						value: 'playTypeCode',
					},
				},
				valueType: 'select',
				request: queryPlayTypeMenu,
			}),
			createOnlySearchCol({
				title: '玩法',
				dataIndex: 'playCode',
				params: { lotteryCode, playTypeCode },
				fieldProps: {
					popupMatchSelectWidth: false,
					disabled: !playTypeCode,
					fieldNames: {
						label: 'playName',
						value: 'playCode',
					},
				},
				valueType: 'select',
				request: async (params) => {
					if (!params?.lotteryCode || !params?.playTypeCode) {
						return [];
					}
					return querySubPlayTypeMenu(params);
				},
			}),
			createReportQuickSelectTimeCol(undefined, {
				// 存在注单跳转时，无需默认时间
				defaultTimeType: period ? false : QuickTimeType.Today,
			}),
			createNumberEnumsCol({
				title: '注单状态',
				dataIndex: 'orderStatus',
				valueEnum: GameOrderStatusEnums,
			}),
			createNumberEnumsCol(
				createOnlySearchCol({
					title: '输赢',
					dataIndex: 'winAndLose',
					valueEnum: GameWinLoseEnums,
				})
			),
			access.GAME_MANAGEMENT_01_ORDER_CANCEL && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 100,
				render: (_, record) => {
					return [
						<MyModalWrapper
							key='cancel'
							content='确认要取消当前选择的单注吗？'
							onFinish={async () => {
								setShowDetail(false);
								if (await handleGameOrderCancel(record, lotteryCode!)) {
									actionRef.current?.reload?.();
									return true;
								}
							}}
						>
							<Button
								type='text'
								disabled={record.orderStatus !== GameOrderStatus.Unsettled}
								style={{ padding: 0 }}
								danger
							>
								取消注单
							</Button>
						</MyModalWrapper>,
					];
				},
			},
		] as ProColumns<API.GameOrderItem>[]
	)
		.filter(Boolean)
		.map((col) => {
			return {
				ellipsis: true,
				hideInSearch:
					!col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
				...col,
			};
		});

	return (
		access.GAME_MANAGEMENT_ORDER_LIST && (
			<>
				<MyTable<
					API.GameOrderItem,
					Partial<TableListPagination> & {
						startTime?: string;
						endTime?: string;
						lotteryCode?: string;
						periodsNumber?: number;
					}
				>
					actionRef={actionRef}
					headerTitle={
						access.GAME_MANAGEMENT_ORDER_CANCEL_SWITCH && (
							<Space>
								<span>取消注单</span>
								<MyModalWrapper
									content={
										<div>
											确认
											<span
												style={{
													color:
														orderCancelStatus?.isCancel === SwitchStatus.Close
															? token.colorPrimary
															: token.colorError,
												}}
											>
												{orderCancelStatus?.isCancel === SwitchStatus.Close
													? '启用'
													: '停用'}
											</span>
											取消注单功能？
										</div>
									}
									onFinish={handleSwitchOrderCancel}
								>
									<Switch
										checkedChildren='开'
										unCheckedChildren='关'
										checked={!!orderCancelStatus?.isCancel}
										disabled={!orderCancelStatus?.id}
									/>
								</MyModalWrapper>
							</Space>
						)
					}
					form={{
						ignoreRules: false,
					}}
					params={{ lotteryCode: lotteryCode }}
					request={async (params, ...others) => {
						if (params.periodsNumber || (params.startTime && params.endTime)) {
							const [tableResult, summaryResult] = await Promise.all([
								queryGameOrderList(params, ...others),
								queryGameOrderSummary(params),
							]);
							setSummaryInfo(summaryResult);
							return tableResult;
						}
						message.warning('请输入游戏期数或者选择时间范围进行查询');
						return {
							success: false,
						};
					}}
					scroll={{ x: 2800, y: '60vh' }}
					columns={columns}
					summary={(pageData) => {
						const totalData = pageData.reduce(
							(res, item) => {
								res.totalTotalAmount += item.totalAmount;
								res.totalValidAmount += item.validAmount;
								res.totalRunningAmount += item.runningAmount;
								res.totalReturnAmount += item.returnAmount;
								res.totalRewardAmount += item.rewardAmount;
								res.totalWinLoseAmount += item.winLoseAmount;
								return res;
							},
							{
								totalTotalAmount: 0,
								totalValidAmount: 0,
								totalRunningAmount: 0,
								totalReturnAmount: 0,
								totalRewardAmount: 0,
								totalWinLoseAmount: 0,
							}
						);
						return (
							<ProTable.Summary fixed>
								<GameOrderSummaryRow
									title='小计'
									totalAmount={totalData.totalTotalAmount}
									validAmount={totalData.totalValidAmount}
									runningAmount={totalData.totalRunningAmount}
									returnAmount={totalData.totalReturnAmount}
									rewardAmount={totalData.totalRewardAmount}
									winLoseAmount={totalData.totalWinLoseAmount}
								/>
								<GameOrderSummaryRow title='合计' {...summaryInfo} />
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
					{currentRow?.id && (
						<ProDescriptions<API.GameOrderItem>
							column={2}
							title={currentRow.orderDetailNo}
							dataSource={currentRow}
							columns={columns as ProDescriptionsItemProps<API.GameOrderItem>[]}
						/>
					)}
				</Drawer>
			</>
		)
	);
};
export default memo(GameOrderList);
