import { ProDescriptions } from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Button, Drawer } from 'antd';
import React, { memo, useRef, useState } from 'react';
import EditGameForm from './EditGameForm';

import { queryGameList } from '@/services/api';
import { handleGameAdd, handleGameUpdate } from '../actions';

import MyTable from '@/components/MyTable';
import type { API } from '@/services/typings';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
	ProFormInstance,
} from '@ant-design/pro-components';

const SearchColWL = ['gameName'];
const CategoryList: React.FC = (props: any) => {
	const access = useAccess();
	const { initialState } = useModel('@@initialState');
	const lotteryMenu = initialState?.lotteryMenu;
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const searchFormRef = useRef<ProFormInstance>();

	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.GameItem>();
	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const onEditFormFinish = async (gameInfo: API.GameEditItem) => {
		// console.log('game info => ', gameInfo);
		// return;
		let success;
		// update
		if (currentRow) {
			// 编辑游戏信息
			success = await handleGameUpdate(gameInfo, currentRow);
		} else {
			success = await handleGameAdd(gameInfo);
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

	const columns: ProColumns<API.GameItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'id',
				// fixed: 'left',
				ellipsis: false,
				width: 100,
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
				title: '游戏类型',
				dataIndex: 'gameTypeName',
			},
			{
				title: '游戏名称',
				dataIndex: 'gameName',
			},
			{
				title: '电脑端图标',
				dataIndex: 'iconUrl', // 默认显示移动端
				valueType: 'image',
				ellipsis: false,
			},
			{
				title: '移动端图标',
				dataIndex: 'moveIconUrl', // 默认显示移动端
				valueType: 'image',
				ellipsis: false,
			},
			{
				title: '游戏介绍',
				dataIndex: 'remark',
			},
			access.GAME_MANAGEMENT_DATA_04 && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 100,
				render: (_, record) => (
					<Button
						key='config'
						onClick={() => {
							handleEditFormVisible(true);
							setCurrentRow(record);
						}}
						type='link'
						disabled={
							!lotteryMenu?.find(
								(lottery) => lottery.lotteryName === record.gameName
							)
						}
					>
						编辑
					</Button>
				),
			},
		] as ProColumns<API.GameItem>[]
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
		<>
			<MyTable<API.GameItem, any>
				actionRef={actionRef}
				formRef={searchFormRef}
				scroll={{ x: 1100 }}
				request={queryGameList}
				columns={columns}
			/>
			<EditGameForm
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
				{currentRow?.id && (
					<ProDescriptions<API.GameItem>
						column={2}
						title={currentRow.gameName}
						dataSource={currentRow}
						columns={columns as ProDescriptionsItemProps<API.GameItem>[]}
					/>
				)}
			</Drawer>
		</>
	);
};
export default memo(CategoryList);
