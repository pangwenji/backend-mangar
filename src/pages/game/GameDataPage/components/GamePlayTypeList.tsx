import { ProDescriptions } from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Button, Drawer, SelectProps } from 'antd';
import React, { memo, useRef, useState } from 'react';

import { queryGamePlayTypeList, queryPlayTypeMenu } from '@/services/api';

import MyModalWrapper from '@/components/MyModalWrapper';
import HighlightText from '@/components/MyModalWrapper/HighlightText';
import MyTable from '@/components/MyTable';
import { SwitchStatus } from '@/services/enums';
import type { API } from '@/services/typings';
import { createOnlySearchCol } from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import useToken from 'antd/es/theme/useToken';
import { handleGamePlayTypeSwitch } from '../actions';

const GamePlayTypeList: React.FC = () => {
	const access = useAccess();
	const token = useToken()[1];
	const { initialState } = useModel('@@initialState');
	const lotteryMenu = initialState?.lotteryMenu;
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.GamePlayTypeItem>();
	const [currentLotteryCode, setCurrentLotteryCode] = useState(
		lotteryMenu?.[0]?.lotteryCode
	);
	const [currentPlayTypeList, setCurrentPlayTypeList] = useState<
		API.GamePlayTypeItem[]
	>([]);

	const columns: ProColumns<API.GamePlayTypeItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'id',
				// fixed: 'left',
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
			createOnlySearchCol({
				title: '游戏',
				dataIndex: 'lotteryCode',
				initialValue: currentLotteryCode,
				fieldProps: {
					popupMatchSelectWidth: false,
					allowClear: false,
					fieldNames: {
						label: 'lotteryName',
						value: 'lotteryCode',
					},
					options: lotteryMenu || [],
					onChange: ((value) => {
						setCurrentLotteryCode(value);
					}) as SelectProps['onChange'],
				},
				valueType: 'select',
				// @ts-ignore
			}),
			createOnlySearchCol({
				title: '玩法',
				dataIndex: 'playTypeCode',
				fieldProps: {
					popupMatchSelectWidth: false,
					fieldNames: {
						label: 'playTypeName',
						value: 'playTypeCode',
					},
				},
				valueType: 'select',
				params: { lotteryCode: currentLotteryCode },
				request: async (params) => {
					if (!params?.lotteryCode) return [];
					return queryPlayTypeMenu(params);
				},
			}),
			{
				title: '游戏名称',
				dataIndex: 'lotteryName',
				width: 250,
			},
			{
				title: '玩法名称',
				dataIndex: 'playTypeName',
			},
			{
				title: '状态',
				dataIndex: 'isValidity',
				width: 200,
				valueEnum: {
					[SwitchStatus.Open]: {
						text: '启用',
						status: 'Success',
					},
					[SwitchStatus.Close]: {
						text: '停用',
						status: 'Error',
					},
				},
				hideInSearch: false,
			},
			access.GAME_MANAGEMENT_DATA_PLAY_TYPE_UPDATE && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 100,
				render: (_, record) => {
					const isValidity = record.isValidity;
					const txt = isValidity ? '停用' : '启用';
					return (
						<MyModalWrapper
							content={
								<div>
									确认要
									<span
										style={{
											color: isValidity ? token.colorError : token.colorSuccess,
										}}
									>
										{txt}
									</span>
									<br />
									<HighlightText>
										"{`${record.lotteryName}-${record.playTypeName}`}"
									</HighlightText>
								</div>
							}
							onFinish={async () => {
								if (
									currentLotteryCode &&
									(await handleGamePlayTypeSwitch(record, currentLotteryCode))
								) {
									actionRef.current?.reload();
									return true;
								} else {
									return false;
								}
							}}
						>
							<Button key='config' type='link'>
								{txt}
							</Button>
						</MyModalWrapper>
					);
				},
			},
		] as ProColumns<API.GamePlayTypeItem>[]
	)
		.filter(Boolean)
		.map((col) => {
			return {
				ellipsis: true,
				hideInSearch: true,
				...col,
			};
		});
	return (
		!!lotteryMenu?.length && (
			<>
				<MyTable<API.GamePlayTypeItem, any>
					actionRef={actionRef}
					scroll={{ x: 1000 }}
					request={queryGamePlayTypeList}
					pagination={false}
					columns={columns}
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
						<ProDescriptions<API.GamePlayTypeItem>
							column={2}
							title={currentRow.playTypeName}
							dataSource={currentRow}
							columns={
								columns as ProDescriptionsItemProps<API.GamePlayTypeItem>[]
							}
						/>
					)}
				</Drawer>
			</>
		)
	);
};
export default memo(GamePlayTypeList);
