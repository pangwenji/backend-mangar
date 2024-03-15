import { Button, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import EditTestForm from './components/EditTestForm';

import { queryTestList } from '@/services/api';
import { css } from '@emotion/css';
import { useAccess } from '@umijs/max';
import useToken from 'antd/es/theme/useToken';
import { isEqual } from 'lodash';
import { handleTestSwitch, handleTestUpdate } from './actions';

import MyModalWrapper from '@/components/MyModalWrapper';
import HighlightText from '@/components/MyModalWrapper/HighlightText';
import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import DrawResult from '@/pages/game/GameDrawList/components/DrawResult';
import type { TableListPagination } from '@/pages/typings';
import type { API } from '@/services/typings';
import type { ActionType, ProColumns } from '@ant-design/pro-components';

const toolBarClass = css`
	.ant-pro-table-list-toolbar-container {
		padding-block-start: 0;
	}
`;

const TestList: React.FC = () => {
	const access = useAccess();
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.TestItem>();
	const token = useToken()[1];

	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const onEditFormFinish = async (value: API.TestEditItem) => {
		let success;
		// update
		if (currentRow) {
			const isChanged = !isEqual(
				{
					...currentRow,
					...value,
				},
				currentRow
			);
			// 有变动
			if (isChanged) {
				success = await handleTestUpdate(value, currentRow);
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

	const columns: ProColumns<API.TestItem>[] = (
		[
			{
				title: '游戏名称',
				dataIndex: 'lotteryName',
				width: 200,
			},
			{
				title: '本期期数',
				dataIndex: 'periodsNumber',
				width: 150,
			},
			{
				title: '开奖结果',
				dataIndex: 'drawingResult',
				render(dom, entity) {
					if (!entity.drawingResult) return dom;
					return (
						<DrawResult
							lotteryCode={entity.lotteryCode}
							drawItem={entity as any}
						/>
					);
				},
			},
			access.SYSTEM_MANAGEMENT_TEST_SWITCH && {
				title: '测试开关',
				dataIndex: 'manualDraw',
				valueType: 'option',
				width: 150,
				render(_, entity) {
					const isOpen = entity.manualDraw;
					const switchTxt = isOpen ? '关闭' : '开启';
					return (
						<MyModalWrapper
							onFinish={async () => {
								if (
									await handleTestSwitch({
										lotteryCode: entity.lotteryCode,
										manualDraw: !isOpen,
									})
								) {
									actionRef.current?.reload();
									return true;
								} else {
									return false;
								}
							}}
							content={
								<div>
									确认要
									<span
										style={{
											color: isOpen ? token.colorError : token.colorPrimary,
										}}
									>
										{switchTxt}
									</span>
									<br />
									<HighlightText>{entity.lotteryName}</HighlightText>
									的测试吗？
								</div>
							}
						>
							<Switch
								checkedChildren='开'
								unCheckedChildren='关'
								checked={isOpen}
								disabled={!access.SYSTEM_MANAGEMENT_TEST_SWITCH}
							/>
						</MyModalWrapper>
					);
				},
			},
			access.SYSTEM_MANAGEMENT_TEST_SET_RESULT && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 125,
				render: (_, record) => (
					<Button
						key='config'
						onClick={() => {
							handleEditFormVisible(true);
							setCurrentRow(record);
						}}
						type='link'
						disabled={
							!access.SYSTEM_MANAGEMENT_TEST_SET_RESULT || !record.manualDraw
						}
					>
						输入开奖结果
					</Button>
				),
			},
		] as ProColumns<API.TestItem>[]
	).filter(Boolean);

	return (
		<MyPageContainer>
			{access.SYSTEM_MANAGEMENT_TEST_LIST && (
				<MyTable<API.TestItem, TableListPagination>
					rowKey='lotteryCode'
					actionRef={actionRef}
					request={queryTestList}
					columns={columns}
					rowSelection={false}
					scroll={{ x: 1000 }}
					search={false}
					pagination={false}
					toolbar={{ className: toolBarClass }}
				/>
			)}
			<EditTestForm
				open={editFormVisible}
				onFinish={onEditFormFinish}
				modalProps={{ onCancel: onEditFormCancel }}
				initialValues={currentRow}
			/>
		</MyPageContainer>
	);
};

export default TestList;
