import { ProDescriptions } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Drawer } from 'antd';
import React, { memo, useRef, useState } from 'react';
import EditGameQuotaForm from './EditGameQuotaForm';

import { queryGameQuotaList } from '@/services/api';
import {
	handleGameQuotaInit,
	handleGameQuotaRefresh,
	handleGameQuotaUpdate,
} from '../actions';

import MyModalWrapper from '@/components/MyModalWrapper';
import MyTable from '@/components/MyTable';
import type { API } from '@/services/typings';
import { createMoneyCol, createMoneyCols } from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';

const QuotaList: React.FC<API.LotteryNMerchatNHandicapParams> = ({
	lotteryCode,
	merchantId,
	handicapCode,
}) => {
	const access = useAccess();

	const [showDetail, setShowDetail] = useState<boolean>(false);
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.GameQuotaItem>();

	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const onEditFormFinish = async (value: API.GameQuotaEditItem) => {
		const quotaInfo = {
			...currentRow,
			...value,
		};
		let success;
		// update
		if (currentRow) {
			// 编辑限额设定信息
			success = await handleGameQuotaUpdate(
				quotaInfo as API.GameQuotaEditItem,
				currentRow,
				{
					merchantId,
					lotteryCode: currentRow.lotteryCode,
					handicapCode,
				}
			);
			// 修改当前限额设定, 需重置全局限额设定数据
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

	const columns: ProColumns<API.GameQuotaItem>[] = (
		[
			{
				title: '玩法名称',
				dataIndex: 'limitGroupName',
				width: 180,
				fixed: 'left',
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
				title: '返水',
				dataIndex: 'returnPointRatio',
				width: 140,
				render(dom, entity) {
					const ratio = entity.returnPointRatio;
					if (typeof ratio === 'number' && !Number.isNaN(ratio)) {
						return `${ratio}%`;
					}
					return dom;
				},
			},
			...createMoneyCols([
				{
					title: '单注最小',
					dataIndex: 'singleMinLimit',
				},
				{
					title: '单注最高',
					dataIndex: 'singleMaxLimit',
				},
				{
					title: '单期最高',
					dataIndex: 'singleIssueLimit',
				},
			]),
			{
				title: '抽水',
				dataIndex: 'drawWaterRatio',
				onCell: (_, index) => {
					if (index === 0) {
						return { rowSpan: 50 };
					} else {
						return {
							rowSpan: 0,
						};
					}
				},
				render(dom, entity) {
					const ratio = entity.drawWaterRatio;
					if (typeof ratio === 'number' && !Number.isNaN(ratio)) {
						return `${ratio}%`;
					}
					return dom;
				},
			},
			createMoneyCol({
				title: '最高赔付',
				dataIndex: 'maxReward',
				onCell: (_, index) => {
					if (index === 0) {
						return { rowSpan: 50 };
					} else {
						return {
							rowSpan: 0,
						};
					}
				},
			}),
			(access.GAME_MANAGEMENT_LIMIT_02 || access.GAME_MANAGEMENT_LIMIT_03) && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 120,
				render: (_, record) => {
					return [
						<MyModalWrapper
							key='init-quota'
							content='确定要初始化当前配置吗'
							onFinish={async () => {
								setShowDetail(false);
								if (
									await handleGameQuotaInit(record, {
										merchantId,
										lotteryCode: record.lotteryCode,
										handicapCode,
									})
								) {
									actionRef.current?.reload?.();
									return true;
								}
							}}
						>
							<Button type='link' disabled={!access.GAME_MANAGEMENT_LIMIT_02}>
								初始化
							</Button>
						</MyModalWrapper>,
						<Button
							type='link'
							key='config'
							onClick={() => {
								handleEditFormVisible(true);
								setCurrentRow(record);
							}}
							disabled={!access.GAME_MANAGEMENT_LIMIT_03}
						>
							编辑
						</Button>,
					];
				},
			},
		] as ProColumns<API.GameQuotaItem>[]
	)
		.filter(Boolean)
		.map((col) => {
			return {
				ellipsis: true,
				...col,
			};
		});
	return (
		<>
			{access.GAME_MANAGEMENT_LIMIT_01 && (
				<MyTable<API.GameQuotaItem, API.LotteryNMerchatNHandicapParams>
					headerTitle={
						access.GAME_MANAGEMENT_LIMIT_04 && (
							<MyModalWrapper
								content='确定要刷新缓存吗'
								onFinish={async () => {
									setShowDetail(false);
									if (
										await handleGameQuotaRefresh({
											lotteryCode,
											merchantId,
											handicapCode,
										})
									) {
										actionRef.current?.reload?.();
										return true;
									}
								}}
							>
								<Button type='primary' key='create-item'>
									刷新缓存
								</Button>
							</MyModalWrapper>
						)
					}
					rowKey='limitGroupCode'
					actionRef={actionRef}
					params={{
						lotteryCode,
						merchantId,
						handicapCode,
					}}
					search={false}
					scroll={{ x: 1500 }}
					toolBarRender={() => [,]}
					request={async (params, ...props) => {
						if (!params.lotteryCode) {
							return {
								success: true,
							};
						}
						return queryGameQuotaList(params, ...props);
					}}
					columns={columns}
				/>
			)}
			<EditGameQuotaForm
				open={editFormVisible}
				onOpenChange={(visible) => {
					if (showDetail && visible) {
						setShowDetail(false);
					}
				}}
				onFinish={onEditFormFinish}
				modalProps={{ onCancel: onEditFormCancel }}
				initialValues={currentRow}
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
				{currentRow?.limitGroupCode && (
					<ProDescriptions<API.GameQuotaItem>
						column={2}
						title={currentRow.limitGroupName}
						dataSource={currentRow}
						columns={columns as ProDescriptionsItemProps<API.GameQuotaItem>[]}
					/>
				)}
			</Drawer>
		</>
	);
};
export default memo(QuotaList);
