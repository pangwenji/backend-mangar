import { ProDescriptions } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Card, Drawer } from 'antd';
import React, { memo, useRef, useState } from 'react';
import EditMemberBanForm, { BannedDaysEnum } from './EditMemberBanForm';

import { queryBanSettingList } from '@/services/api';
import { handleBanSettingAdd, handleBanSettingDelete } from '../actions';

import MyModalWrapper from '@/components/MyModalWrapper';
import MyTable from '@/components/MyTable';
import SettingCardWrapper from '@/components/SettingCardWrapper';
import type { API } from '@/services/typings';
import { createNumberEnumsCol, createTimeCols } from '@/utils/tableCols';
import { PlusOutlined } from '@ant-design/icons';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
	ProFormInstance,
} from '@ant-design/pro-components';
import SettingToolTip from './SettingToolTip';

const SearchColWL = ['accountName'];

const MemberBanList: React.FC = (props: any) => {
	const access = useAccess();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const searchFormRef = useRef<ProFormInstance>();

	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.MemberBanItem>();
	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const onEditFormFinish = async (banInfo: API.MemberBanEditItem) => {
		const success = await handleBanSettingAdd(banInfo);

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

	const columns: ProColumns<API.MemberBanItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'id',
				// fixed: 'left',
				width: 100,
			},
			{
				title: '会员账号',
				dataIndex: 'accountName',
			},
			...createTimeCols([
				{
					title: '开始时间',
					dataIndex: 'startTime',
				},
				{
					title: '结束时间',
					dataIndex: 'endTime',
				},
			]),
			createNumberEnumsCol({
				title: '禁言期限(天)',
				dataIndex: 'days',
				valueEnum: BannedDaysEnum,
			}),
			access.CHAT_MANAGEMENT_SPEAK_BAN_DELETE && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 100,
				render: (_, record) => (
					<MyModalWrapper
						content='确认要删除该条禁言配置?'
						onFinish={async () => {
							if (await handleBanSettingDelete(record.id)) {
								actionRef.current?.reload();
								return true;
							}
						}}
					>
						<Button key='config' type='text' danger>
							删除
						</Button>
					</MyModalWrapper>
				),
			},
		] as ProColumns<API.MemberBanItem>[]
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
		<SettingCardWrapper>
			{access.CHAT_MANAGEMENT_SPEAK_BAN_LIST && (
				<Card
					title={
						<>
							会员禁言配置
							<SettingToolTip title='配置期限內禁止會員發言' />
						</>
					}
				>
					<MyTable<API.MemberBanItem, any>
						actionRef={actionRef}
						formRef={searchFormRef}
						scroll={{ x: 1000 }}
						request={queryBanSettingList}
						columns={columns}
						toolBarRender={() => [
							access.CHAT_MANAGEMENT_SPEAK_BAN_ADD && (
								<Button
									type='primary'
									key='create-item'
									onClick={() => {
										handleEditFormVisible(true);
									}}
								>
									<PlusOutlined /> 新建
								</Button>
							),
						]}
					/>
				</Card>
			)}
			<EditMemberBanForm
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
					<ProDescriptions<API.MemberBanItem>
						column={2}
						title={currentRow.accountName}
						dataSource={currentRow}
						columns={columns as ProDescriptionsItemProps<API.MemberBanItem>[]}
					/>
				)}
			</Drawer>
		</SettingCardWrapper>
	);
};
export default memo(MemberBanList);
