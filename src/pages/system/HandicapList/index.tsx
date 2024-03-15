import { Button, Form, message, SelectProps, Switch } from 'antd';
import React, { useRef, useState } from 'react';

import { queryHandicapList } from '@/services/api';
import { css } from '@emotion/css';
import { useAccess } from '@umijs/max';
import { isEqual, pick } from 'lodash';
import { handleHandicapUpdate } from './actions';

import MySelect from '@/components/MyFormSelect/MySelect';
import MyModalWrapper from '@/components/MyModalWrapper';
import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import { SwitchStatus } from '@/services/enums';
import type { API } from '@/services/typings';
import { createEditableCol } from '@/utils/tableCols';
import { ReloadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import './index.less';

const toolBarClass = css`
	.ant-pro-table-list-toolbar-container {
		padding-block-start: 0;
	}
`;

const HandicapNumOptions: SelectProps['options'] = Array(7)
	.fill(2)
	.map((item, index) => {
		const value = item + index;
		return {
			label: value,
			value: value,
		};
	});

const HandicapList: React.FC = () => {
	const access = useAccess();
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.HandicapItem>();
	const [editForm] = Form.useForm();
	const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

	/** 编辑 */
	const onEditFormFinish = async () => {
		if (!currentRow) return;
		const editedList = editForm.getFieldsValue();
		const editedItem = editedList[currentRow.gameCode] as API.HandicapEditItem;
		let success;
		// update
		if (currentRow) {
			const isChanged = !isEqual(
				{
					...currentRow,
					...editedItem,
				},
				currentRow
			);
			// 有变动
			if (isChanged) {
				success = await handleHandicapUpdate({
					...editedItem,
					gameCode: currentRow.gameCode,
					handicapSwitch: Number(editedItem.handicapSwitch),
				});
			} else {
				success = true;
				message.info('当前配置无任何改动');
			}
		}
		// 成功后都需要关闭编辑窗口, 刷新数据
		if (success) {
			setCurrentRow(undefined);
		}
		return success;
	};

	const columns: ProColumns<API.HandicapItem>[] = (
		[
			{
				title: '游戏名称',
				dataIndex: 'gameName',
				width: 200,
			},
			createEditableCol(
				{
					title: '开关',
					dataIndex: 'handicapSwitch',
					valueType: 'select',
					renderFormItem(_, config) {
						const entity = config.record!;
						return (
							<Switch
								checkedChildren='开'
								unCheckedChildren='关'
								{...pick(config, ['onChange', 'onSelect', 'checked'])}
								defaultChecked={!!entity.handicapSwitch}
								disabled={!access.SYSTEM_MANAGEMENT_HANDICAP_UPDATE}
							/>
						);
					},
				},
				editForm
			),
			createEditableCol(
				{
					title: '盘口数量',
					dataIndex: 'handicapNum',
					renderFormItem(_, config) {
						const record = editForm.getFieldsValue([config.recordKey!]);
						return (
							<MySelect
								isNumber
								style={{ width: '6em', minWidth: 'max-content' }}
								{...pick(config, ['onChange', 'onSelect', 'value'])}
								options={HandicapNumOptions}
								disabled={
									!access.SYSTEM_MANAGEMENT_HANDICAP_UPDATE ||
									!(record[config.recordKey as string] as API.HandicapEditItem)
										?.handicapSwitch
								}
								allowClear={false}
							/>
						);
					},
				},
				editForm
			),
			{
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
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
							disabled={!access.SYSTEM_MANAGEMENT_HANDICAP_UPDATE}
						>
							保存更新
						</Button>
					</MyModalWrapper>
				),
			},
		] as ProColumns<API.HandicapItem>[]
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

	return (
		<MyPageContainer>
			{access.SYSTEM_MANAGEMENT_HANDICAP_LIST && (
				<MyTable<API.HandicapItem, TableListPagination>
					className='hadicapCodeTable'
					rowKey='gameCode'
					actionRef={actionRef}
					request={async (...params) => {
						const result = await queryHandicapList(...params);
						result.data = result.data?.map((item) => {
							return {
								...item,
								// 默认数量为 2
								handicapNum:
									item.handicapSwitch === SwitchStatus.Close &&
									item.handicapNum < 2
										? 2
										: item.handicapNum,
							};
						});
						setEditableRowKeys(result.data?.map((item) => item.gameCode) || []);
						return result;
					}}
					onDataSourceChange={() => {
						editForm.resetFields();
					}}
					columns={columns}
					rowSelection={false}
					scroll={{ x: 700 }}
					search={false}
					pagination={false}
					editable={{
						form: editForm,
						editableKeys: editableKeys,
						onChange: setEditableRowKeys,
					}}
					toolbar={{
						className: toolBarClass,
						settings: [
							{
								icon: <ReloadOutlined />,
								tooltip: '重置',
								key: '_reset_list',
								onClick() {
									actionRef.current?.reload();
								},
							},
						],
					}}
				/>
			)}
		</MyPageContainer>
	);
};

export default HandicapList;
