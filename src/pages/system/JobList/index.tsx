import { PlusOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Drawer, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import EditJobForm, { IsFirstEnums } from './components/EditJobForm';

import { queryJobList } from '@/services/api';
import { useAccess } from '@umijs/max';
import { isEqual, omit } from 'lodash';
import {
	handleJobAdd,
	handleJobRemove,
	handleJobSwitch,
	handleJobUpdate,
} from './actions';

import MyJSONEditor from '@/components/MyJSONEditor';
import MyModalWrapper from '@/components/MyModalWrapper';
import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import { SwitchStatusEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import { createNumberEnumsCol } from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import useToken from 'antd/es/theme/useToken';

const SearchColWL = ['jobHandler', 'enumName', 'jobName', 'isValidity'];

const JobList: React.FC = () => {
	const access = useAccess();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.JobItem>();
	const token = useToken()[1];

	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const onEditFormFinish = async (value: API.JobEditItem) => {
		const adminJobInfo = {
			...currentRow,
			...value,
		} as API.JobEditItem;

		let success;
		// update
		if (currentRow) {
			const isChanged = !isEqual(adminJobInfo, currentRow);
			// 有变动
			if (isChanged) {
				success = await handleJobUpdate(adminJobInfo, currentRow);
			} else {
				success = true;
				message.info('当前任务信息无任何改动');
			}
		} else {
			// create
			success = await handleJobAdd(adminJobInfo);
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

	const columns: ProColumns<API.JobItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'id',
				width: 120,
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
				title: '平台编码',
				dataIndex: 'enumName',
			},
			{
				title: '名称',
				dataIndex: 'jobName',
			},
			{
				title: '权重',
				dataIndex: 'weight',
				width: 90,
			},
			{
				title: 'KEY',
				dataIndex: 'jobHandler',
			},
			{
				title: 'URL',
				dataIndex: 'url',
				ellipsis: true,
			},
			{
				title: '期号',
				dataIndex: 'periodsNumber',
			},
			{
				title: '开奖号码',
				dataIndex: 'drawingResult',
			},
			{
				title: '开奖时间',
				dataIndex: 'drawingDate',
			},
			{
				title: '数组名称',
				dataIndex: 'jsonArrayKey',
			},
			{
				title: '对象名称',
				dataIndex: 'jsonObjectKey',
			},
			{
				title: '是否可以作为第一期',
				dataIndex: 'isFirst',
				width: 100,
				valueEnum: IsFirstEnums,
			},
			{
				title: '响应代码',
				dataIndex: 'code',
			},
			{
				title: '提示代码',
				dataIndex: 'msg',
			},
			{
				title: '响应成功值',
				dataIndex: 'codeValue',
			},
			{
				title: '提示成功值',
				dataIndex: 'msgValue',
			},
			{
				title: '额外参数',
				dataIndex: 'param',
				width: 300,
				ellipsis: true,
			},
			{
				title: '备注',
				dataIndex: 'remark',
				ellipsis: true,
			},
			access.SYSTEM_MANAGEMENT_TASK_03 &&
				createNumberEnumsCol({
					title: '状态',
					dataIndex: 'isValidity',
					valueType: 'select',
					width: 70,
					fixed: 'right',
					valueEnum: SwitchStatusEnums,
					render(_, entity) {
						const isOpen = !!entity.isValidity;
						const switchTxt = isOpen ? '关闭' : '开启';
						return (
							<MyModalWrapper
								onFinish={async () => {
									if (
										await handleJobSwitch({
											id: entity.id,
											isValidity: Number(!isOpen),
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
										该任务吗？
									</div>
								}
							>
								<Switch
									checkedChildren='开'
									unCheckedChildren='关'
									checked={isOpen}
									disabled={!access.SYSTEM_MANAGEMENT_TASK_03}
								/>
							</MyModalWrapper>
						);
					},
				}),
			(access.SYSTEM_MANAGEMENT_TASK_03 ||
				access.SYSTEM_MANAGEMENT_TASK_04) && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 105,
				render: (_, record) => [
					<Button
						key='config'
						onClick={() => {
							handleEditFormVisible(true);
							setCurrentRow(record);
						}}
						type='link'
						disabled={!access.SYSTEM_MANAGEMENT_TASK_03}
					>
						编辑
					</Button>,
					<MyModalWrapper
						key='delete'
						content='确定要删除当前任务吗'
						onFinish={async () => {
							setShowDetail(false);
							if (await handleJobRemove(record)) {
								actionRef.current?.reload?.();
								return true;
							}
						}}
					>
						<Button
							type='text'
							danger
							disabled={!access.SYSTEM_MANAGEMENT_TASK_04}
						>
							删除
						</Button>
					</MyModalWrapper>,
				],
			},
		] as ProColumns<API.JobItem>[]
	)
		.filter(Boolean)
		.map((col) => {
			return {
				...col,
				hideInSearch:
					!col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
			};
		});

	const paramColIndex = columns.findIndex((col) => col.dataIndex === 'param');
	const paramCol = columns[paramColIndex];
	const descCols = [...columns] as ProDescriptionsItemProps<API.JobItem>[];
	descCols[paramColIndex - 1] = {
		...descCols[paramColIndex - 1],
		span: 2,
	};
	descCols[paramColIndex] = {
		...paramCol,
		ellipsis: false,
		span: 2,
		render(dom, entity) {
			if (entity.param) {
				return <MyJSONEditor mode='view' value={entity.param} />;
			}
			return dom;
		},
	} as ProDescriptionsItemProps<API.JobItem>;
	// 处理开关切换在详情的显示
	const isValidityIndex = columns.findIndex(
		(col) => col.dataIndex === 'isValidity'
	);
	descCols[isValidityIndex] = {
		...omit(descCols[isValidityIndex], 'render'),
	};

	return (
		<MyPageContainer>
			{access.SYSTEM_MANAGEMENT_TASK_01 && (
				<MyTable<API.JobItem, TableListPagination>
					actionRef={actionRef}
					toolBarRender={() => [
						access.SYSTEM_MANAGEMENT_TASK_02 && (
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
					request={queryJobList}
					columns={columns}
					rowSelection={false}
					scroll={{ x: 3700 }}
				/>
			)}
			<EditJobForm
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
					<ProDescriptions<API.JobItem>
						column={1}
						title={currentRow?.jobHandler}
						dataSource={currentRow}
						columns={descCols as ProDescriptionsItemProps<API.JobItem>[]}
					/>
				)}
			</Drawer>
		</MyPageContainer>
	);
};

export default JobList;
