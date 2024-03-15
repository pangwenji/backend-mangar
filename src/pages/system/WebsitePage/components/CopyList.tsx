import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

import { queryCopyList } from '@/services/api';
import { useAccess } from '@umijs/max';
import { isEqual } from 'lodash';
import { handleCopyUpdate } from '../actions';

import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import type { API } from '@/services/typings';
import { createTextEditroCol } from '@/utils/tableCols';
import {
	ProDescriptions,
	ProDescriptionsItemProps,
	type ActionType,
	type ProColumns,
} from '@ant-design/pro-components';
import EditCopyDocForm from './EditCopyDocForm';

const CopyList: React.FC = () => {
	const access = useAccess();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.CopyItem>();
	const [editPlayDoc, setEditPlayDoc] = useState(true);
	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const onEditFormFinish = async (value: API.CopyEditItem) => {
		const copyInfo = {
			...currentRow,
			...value,
		} as API.CopyEditItem;

		let success;
		// update
		if (currentRow) {
			const isChanged = !isEqual(copyInfo, currentRow);
			// 有变动
			if (isChanged) {
				success = await handleCopyUpdate(copyInfo, currentRow);
			} else {
				success = true;
				message.info('当前信息无任何改动');
			}
		}
		// 成功后都需要关闭编辑窗口, 刷新数据
		if (success) {
			handleEditFormVisible(false);
			setCurrentRow(undefined);
			if (actionRef.current) {
				actionRef.current.reload();
			}
		}
	};
	const onEditFormCancel = () => {
		handleEditFormVisible(false);
		setCurrentRow(undefined);
	};

	const columns: ProColumns<API.CopyItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'id',
				width: 200,
			},
			{
				title: '游戏名称',
				dataIndex: 'lotteryType',
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
			...createTextEditroCol<API.CopyItem>({
				title: '玩法说明',
				dataIndex: 'playDoc',
				valueType: 'option',
				width: 200,
				render: (_, record) => (
					<Button
						key='config'
						onClick={() => {
							handleEditFormVisible(true);
							setEditPlayDoc(true);
							setCurrentRow(record);
						}}
						type='link'
						disabled={!access.SYSTEM_MANAGEMENT_WEBSITE_COPY_UPDATE}
					>
						编辑
					</Button>
				),
			}),
			...createTextEditroCol<API.CopyItem>({
				title: '游戏赔率',
				dataIndex: 'oddDoc',
				valueType: 'option',
				width: 200,
				render: (_, record) => (
					<Button
						key='config'
						onClick={() => {
							handleEditFormVisible(true);
							setEditPlayDoc(false);
							setCurrentRow(record);
						}}
						type='link'
						disabled={!access.SYSTEM_MANAGEMENT_WEBSITE_COPY_UPDATE}
					>
						编辑
					</Button>
				),
			}),
		] as ProColumns<API.CopyItem>[]
	)
		.filter(Boolean)
		.map((col) => {
			return {
				...col,
				hideInSearch: true,
			};
		});

	return (
		<>
			<MyTable<API.CopyItem, TableListPagination>
				actionRef={actionRef}
				request={queryCopyList}
				columns={columns}
				rowSelection={false}
				scroll={{ x: 1100 }}
				search={false}
				pagination={false}
			/>
			<EditCopyDocForm
				isPlayDoc={editPlayDoc}
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
				width={700}
				open={showDetail}
				onClose={() => {
					setCurrentRow(undefined);
					setShowDetail(false);
				}}
				closable={false}
			>
				{currentRow?.id && (
					<ProDescriptions<API.CopyItem>
						column={1}
						title={currentRow?.lotteryType}
						dataSource={currentRow}
						// columns={descCols}
						columns={columns as ProDescriptionsItemProps<API.CopyItem>[]}
					/>
				)}
			</Drawer>
		</>
	);
};

export default CopyList;
