import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import EditTextImgForm from './EditTextImgForm';

import { queryTextImgList } from '@/services/api';
import { useAccess } from '@umijs/max';
import { isEqual } from 'lodash';
import { handleTextImgUpdate } from '../actions';

import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import type { API } from '@/services/typings';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';

const TextImgList: React.FC = () => {
	const access = useAccess();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.TextImgItem>();

	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const onEditFormFinish = async (value: API.TextImgEditItem) => {
		const websiteInfo = {
			...currentRow,
			...value,
		} as API.TextImgEditItem;

		let success;
		// update
		if (currentRow) {
			const isChanged = !isEqual(websiteInfo, currentRow);
			// 有变动
			if (isChanged) {
				success = await handleTextImgUpdate(websiteInfo, currentRow);
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

	const columns: ProColumns<API.TextImgItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'id',
				width: 120,
			},
			{
				title: '名称',
				dataIndex: 'name',
				width: 200,
			},
			{
				title: '类型',
				dataIndex: 'type',
				width: 120,
			},
			{
				title: '尺寸',
				dataIndex: 'imgSize',
				width: 200,
			},
			{
				title: '备注',
				dataIndex: 'remark',
				ellipsis: true,
			},
			{
				title: '预览',
				dataIndex: 'fileUrl',
				valueType: 'image',
				width: 120,
			},
			access.SYSTEM_MANAGEMENT_WEBSIT_UPDATE && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 105,
				render: (_, record) => (
					<Button
						key='config'
						onClick={() => {
							handleEditFormVisible(true);
							setCurrentRow(record);
						}}
						type='link'
						disabled={!access.SYSTEM_MANAGEMENT_WEBSIT_UPDATE}
					>
						编辑
					</Button>
				),
			},
		] as ProColumns<API.TextImgItem>[]
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
			<MyTable<API.TextImgItem, TableListPagination>
				actionRef={actionRef}
				request={queryTextImgList}
				columns={columns}
				rowSelection={false}
				scroll={{ x: 1200 }}
				search={false}
				pagination={false}
			/>
			<EditTextImgForm
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
					<ProDescriptions<API.TextImgItem>
						column={2}
						title={currentRow?.name}
						dataSource={currentRow}
						columns={columns as ProDescriptionsItemProps<API.TextImgItem>[]}
					/>
				)}
			</Drawer>
		</>
	);
};

export default TextImgList;
