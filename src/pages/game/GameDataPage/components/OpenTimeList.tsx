import { Button, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';

import { queryOpenTimeList } from '@/services/api';
import { useAccess } from '@umijs/max';
import { isEqual, omit, padStart } from 'lodash';
import { handleOpenTimeSwitch, handleOpenTimeUpdate } from '../actions';

import MyModalWrapper from '@/components/MyModalWrapper';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import { SwitchStatus } from '@/services/enums';
import type { API } from '@/services/typings';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import EditOpenTimeModal, { parseSeconds } from './EditOpenTime';

import '../index.less';

const OpenTimeModeEnums = {
	[SwitchStatus.Open]: '自动开盘',
	[SwitchStatus.Close]: '手动开盘',
};

const OpenTimeList: React.FC = () => {
	const access = useAccess();
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.OpenTimeItem>();
	const [editedList, setEditedList] = useState<API.OpenTimeEditItem[]>([]);
	/** 编辑 */
	const onEditFormFinish = async () => {
		if (!currentRow) return;

		const editedItemIndex = editedList.findIndex(
			(item) => item.gameCode === currentRow.gameCode
		);
		const editedItem = editedItemIndex > -1 ? editedList[editedItemIndex] : {};
		let success;
		// update
		if (editedItem) {
			const isChanged = !isEqual(
				{
					...currentRow,
					...editedItem,
				},
				currentRow
			);
			// 有变动
			if (isChanged) {
				success = await handleOpenTimeUpdate(
					editedItem as API.OpenTimeEditItem
				);
				success && actionRef.current?.reload();
			} else {
				success = true;
				message.info('当前配置无任何改动');
			}
		}
		// 成功后都需要关闭编辑窗口, 刷新数据
		if (success) {
			setCurrentRow(undefined);
			if (editedItemIndex > -1) {
				setEditedList((list) => {
					const res = [...list];
					return res.splice(editedItemIndex, 1);
				});
			}
		}
		return success;
	};

	// 编辑时间弹窗
	const [openDialog, setOpenDialog] = useState(false);
	const handleTimeOk = (row: API.OpenTimeEditItem) => {
		setEditedList((list) => {
			const result = [...list];
			const index = result.findIndex((item) => item.gameCode === row.gameCode);
			if (index > -1) {
				result.splice(index, 1, row);
			} else {
				result.push(row);
			}
			return result;
		});
		handleTimeCancel();
	};
	const handleTimeCancel = () => {
		setCurrentRow(undefined);
		setOpenDialog(false);
	};

	const columns: ProColumns<API.OpenTimeItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'orderNum',
				width: 100,
			},
			{
				title: '游戏名称',
				dataIndex: 'gameName',
				width: 220,
			},
			access.GAME_MANAGEMENT_DATA_TIME_SWITCH && {
				title: '切换模式',
				dataIndex: 'isAutoDrawing',
				valueType: 'select',
				width: 150,
				render(_, entity) {
					return (
						<MyModalWrapper
							content={`确认切换成${
								entity.isAutoDrawing
									? OpenTimeModeEnums[SwitchStatus.Close]
									: OpenTimeModeEnums[SwitchStatus.Open]
							}吗？`}
							onFinish={async () => {
								if (
									await handleOpenTimeSwitch({
										gameCode: entity.gameCode,
										isAutoDrawing: Number(!entity.isAutoDrawing),
									})
								) {
									actionRef.current?.reload();
									return true;
								}
							}}
						>
							<Switch
								checkedChildren='自'
								unCheckedChildren='手'
								checked={!!entity.isAutoDrawing}
								disabled={!access.GAME_MANAGEMENT_DATA_TIME_SWITCH}
							/>
						</MyModalWrapper>
					);
				},
			},
			{
				title: '当前模式',
				dataIndex: 'isAutoDrawing',
				valueEnum: OpenTimeModeEnums,
				width: 150,
			},
			{
				title: '开盘时间',
				dataIndex: 'drawingDate',
				tooltip: '当期开奖后多久开盘',
				width: 400,
				render(_, entity) {
					if (entity.isAutoDrawing) return '自动';
					const editedItem = editedList.find(
						(item) => item.gameCode === entity.gameCode
					);
					const parsed = parseSeconds(
						editedItem ? editedItem.drawingDate : entity.drawingDate
					);
					return (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{`${padStart(`${parsed.day}`, 2, '0')}天`}
							{`${padStart(`${parsed.hour}`, 2, '0')}小时`}
							{`${padStart(`${parsed.minute}`, 2, '0')}分`}
							{`${padStart(`${parsed.second}`, 2, '0')}秒`}
							{access.GAME_MANAGEMENT_DATA_TIME_SWITCH && (
								<>
									&nbsp;
									<Button
										type='link'
										onClick={() => {
											setCurrentRow(entity);
											setOpenDialog(true);
										}}
									>
										编辑
									</Button>
								</>
							)}
						</div>
					);
				},
			},
			access.GAME_MANAGEMENT_DATA_TIME_SWITCH && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				width: 150,
				fixed: 'right',
				render: (_, entity) => (
					<MyModalWrapper
						content='确认保存当前更新吗？'
						onFinish={onEditFormFinish}
					>
						<Button
							key='config'
							onClick={() => {
								setCurrentRow(entity);
							}}
							disabled={
								!!entity.isAutoDrawing ||
								!access.GAME_MANAGEMENT_DATA_TIME_SWITCH
							}
						>
							保存更新
						</Button>
					</MyModalWrapper>
				),
			},
		] as ProColumns<API.OpenTimeItem>[]
	)
		.filter(Boolean)
		.map((col) => {
			return {
				hideInSearch: true,
				editable: false,
				hideInForm: true,
				width: 'auto',
				...col,
			};
		});

	const editedItem = currentRow
		? editedList.find((item) => item.gameCode === currentRow?.gameCode) ||
		  currentRow
		: currentRow;

	return (
		<>
			<MyTable<API.OpenTimeItem, TableListPagination>
				rowKey='gameCode'
				actionRef={actionRef}
				request={queryOpenTimeList}
				columns={columns}
				rowSelection={false}
				scroll={{ x: 700 }}
				search={false}
				onDataSourceChange={() => {
					setEditedList([]);
				}}
			/>
			<EditOpenTimeModal
				open={openDialog}
				row={
					editedItem && (omit(editedItem, ['gameName']) as API.OpenTimeEditItem)
				}
				onCancel={handleTimeCancel}
				onOk={handleTimeOk}
			/>
		</>
	);
};

export default OpenTimeList;
