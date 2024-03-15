import { ProDescriptions } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { queryBalanceLogList, queryTradeTypeMenu } from '@/services/api';

import { QuickTimeType } from '@/components/MyDateTimePicker/tools';
import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import type { API } from '@/services/typings';
import {
	createMoneyCols,
	createQuickSelectTimeCol,
	createTimeCol,
} from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';

const SearchColWL = ['accountName', 'tradeType'];

const BalanceLogList: React.FC = () => {
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.BalanceLogItem>();

	const columns: ProColumns<API.BalanceLogItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'id',
				fixed: 'left',
				width: 130,
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
				title: '会员账号',
				dataIndex: 'accountName',
			},
			{
				title: '交易类型',
				dataIndex: 'tradeType',
				valueType: 'select',
				request: queryTradeTypeMenu,
				fieldProps: {
					popupMatchSelectWidth: false,
					fieldNames: {
						label: 'tradeName',
						value: 'tradeType',
					},
				},
			},
			...createMoneyCols([
				{
					title: '交易金额',
					dataIndex: 'tradeAmount',
				},
				{
					title: '账号余额',
					dataIndex: 'afterBalance',
				},
			]),
			createTimeCol({
				title: '交易时间',
				dataIndex: 'createTime',
			}),
			{
				title: '备注',
				dataIndex: 'remark',
				ellipsis: true,
			},
			createQuickSelectTimeCol(
				{
					title: '日期',
				},
				{ defaultTimeType: QuickTimeType.Today }
			),
		] as ProColumns<API.BalanceLogItem>[]
	).map((col) => {
		return {
			hideInSearch:
				!col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
			...col,
		};
	});

	return (
		<MyPageContainer>
			<MyTable<API.BalanceLogItem, TableListPagination>
				actionRef={actionRef}
				rowKey='id'
				scroll={{ x: 1200 }}
				request={queryBalanceLogList}
				columns={columns}
				rowSelection={false}
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
				{currentRow?.accountName && (
					<ProDescriptions<API.BalanceLogItem>
						column={2}
						title={currentRow?.accountName}
						dataSource={currentRow}
						columns={columns as ProDescriptionsItemProps<API.BalanceLogItem>[]}
					/>
				)}
			</Drawer>
		</MyPageContainer>
	);
};

export default BalanceLogList;
