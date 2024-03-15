import { AppRoutePath } from '@/../config/routes';
import MyTable from '@/components/MyTable';
import { queryGameDrawList } from '@/services/api';
import type { API } from '@/services/typings';
import { createMoneyCols, createTimeCol } from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { ProDescriptions } from '@ant-design/pro-components';
import { history, useAccess } from '@umijs/max';
import { Button, Drawer } from 'antd';
import React, { memo, useRef, useState } from 'react';
import {
	handleCancelAllOrder,
	handleManualDrawing,
	handleSkipDrawing,
} from '../actions';
import DrawResult from './DrawResult';
import EditManualDrawForm, {
	EditManulDrawType,
	ManualDrawType,
} from './EditManualDrawForm';

import MyModalWrapper from '@/components/MyModalWrapper';
import { GameDrawStatus } from '@/services/enums';
import '../index.less';

const SearchColWL = ['periodsNumber'];
const DrawList: React.FC<{
	lotteryCode: string;
}> = ({ lotteryCode }) => {
	const access = useAccess();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.GameDrawItem>();

	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const onEditFormFinish = async (drawInfo: EditManulDrawType) => {
		if (!currentRow) return;
		let success;
		// 手动开奖
		if (drawInfo.manualType === ManualDrawType.Manual) {
			success = await handleManualDrawing({
				lotteryCode,
				periodsNumber: currentRow.periodsNumber,
				drawingResult: drawInfo.drawingResult!,
			});
		} else {
			success = await handleSkipDrawing({
				lotteryCode,
				periodsNumber: currentRow.periodsNumber,
			});
		}
		// 成功后都需要关闭编辑窗口, 刷新数据
		if (success) {
			setCurrentRow(undefined);
			handleEditFormVisible(false);
			if (actionRef.current) {
				actionRef.current.reload();
			}
		}
	};
	const onEditFormCancel = () => {
		handleEditFormVisible(false);
		if (currentRow) {
			setCurrentRow(undefined);
		}
	};
	const manualAccess = access.GAME_MANAGEMENT_DRAW_MANUAL;
	const checkOrderAccess =
		access.GAME_MANAGEMENT_ORDER && access.GAME_MANAGEMENT_ORDER_LIST;
	const cancelOrderAccess = access.GAME_MANAGEMENT_DRAW_CANCEL_ORDER;
	const columns: ProColumns<API.GameDrawItem>[] = (
		[
			{
				title: '期号',
				dataIndex: 'periodsNumber',
				width: 100,
				fixed: 'left',
				ellipsis: false,
				/* valueType: 'digit',
				fieldProps: {
					controls: false,
					precision: 0,
				}, */
				formItemProps: {
					rules: [
						{
							validator(_, value) {
								if (
									!value ||
									(Number.isInteger(Number(value)) && Number(value) > 0)
								) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('请输入正确的期号'));
							},
						},
					],
				},
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
			createTimeCol({
				title: '开奖时间',
				dataIndex: 'drawingDate',
			}),
			{
				title: '开奖结果',
				dataIndex: 'drawingResult',
				width: 450,
				render(dom, entity) {
					if (!lotteryCode || !entity.drawingResult) return dom;
					return <DrawResult lotteryCode={lotteryCode} drawItem={entity} />;
				},
				ellipsis: false,
			},
			{
				title: '注单数量',
				dataIndex: 'betNum',
			},
			{
				title: '投注人数',
				dataIndex: 'betPeople',
			},
			...createMoneyCols([
				{
					title: '投注总额',
					dataIndex: 'totalAmount',
				},
				{
					title: '派彩金额',
					dataIndex: 'rewardAmount',
				},
				{
					title: '系统盈亏',
					dataIndex: 'winLoseAmount',
				},
			]),
			// 注单权限
			(manualAccess || checkOrderAccess || cancelOrderAccess) && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 220,
				render: (_, record) => {
					// 未结算注单：期号状态是未开奖（0 已开盘 3开奖失败）状态
					const disabledStatusList = [
						GameDrawStatus.Open,
						GameDrawStatus.Failed,
					];
					// 可消本期注单
					const hasOrderToCancel =
						record.betNum !== 0 && disabledStatusList.includes(record.status);

					// 到了开奖时间，并且状态是0，或者3 或者4
					// 可手动开奖状态
					const manualStatusList = [
						...disabledStatusList,
						GameDrawStatus.Closed,
					];
					// 是否到了开奖时间
					const isOverTime =
						Date.now() >= new Date(record.drawingDate).getTime();
					// 是否可以手动开奖
					const canManual =
						isOverTime && manualStatusList.includes(record.status);

					// 是否存在注单
					const hasOrder = record.betNum;

					return [
						manualAccess && (
							<Button
								key='manual-draw'
								type='link'
								disabled={!canManual}
								onClick={() => {
									handleEditFormVisible(true);
									setCurrentRow(record);
								}}
							>
								手动开奖
							</Button>
						),
						checkOrderAccess && (
							<Button
								key='config'
								type='text'
								disabled={!hasOrder}
								onClick={() => {
									history.push(AppRoutePath.GameOrderList, {
										periodsNumber: record.periodsNumber,
										lotteryCode,
									});
								}}
							>
								查看注单
							</Button>
						),
						// 当时时间 > 开奖时间 并且期号状态是未开奖或者开奖失败的状态
						cancelOrderAccess && (
							<MyModalWrapper
								content='确认取消这一期的所有注单？'
								onFinish={async () => {
									if (
										await handleCancelAllOrder({
											lotteryCode,
											periodsNumber: record.periodsNumber,
										})
									) {
										actionRef.current?.reload();
										return true;
									}
								}}
							>
								<Button
									key='cancel-order'
									type='link'
									disabled={!hasOrderToCancel}
								>
									取消注单
								</Button>
							</MyModalWrapper>
						),
					].filter(Boolean);
				},
			},
		] as ProColumns<API.GameDrawItem>[]
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
		access.GAME_MANAGEMENT_DRAW_LIST && (
			<>
				<MyTable<API.GameDrawItem, any>
					className='draw-list'
					actionRef={actionRef}
					params={{ lotteryCode: lotteryCode }}
					request={queryGameDrawList}
					scroll={{ x: 1850 }}
					columns={columns}
					form={{
						ignoreRules: false,
					}}
				/>
				<EditManualDrawForm
					open={editFormVisible}
					onOpenChange={(visible) => {
						if (showDetail && visible) {
							setShowDetail(false);
						}
					}}
					onFinish={onEditFormFinish}
					modalProps={{ onCancel: onEditFormCancel }}
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
						<ProDescriptions<API.GameDrawItem>
							column={1}
							title={currentRow.periodsNumber}
							dataSource={currentRow}
							columns={columns as ProDescriptionsItemProps<API.GameDrawItem>[]}
						/>
					)}
				</Drawer>
			</>
		)
	);
};
export default memo(DrawList);
