import { PlusOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import EditAdminForm from './components/EditAdminForm';

import { getRoleMenuForAdmin, queryAdminList } from '@/services/api';
import {
	handleAdminAdd,
	handleAdminauthorize,
	handleAdminBindRole,
	handleAdminPWDUpdate,
	handleAdminsEnable,
	handleAdminsRemove,
	handleAdminUpdate,
} from './actions';

import MyModalWrapper from '@/components/MyModalWrapper';
import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import {
	AdminGoogleBindEnums,
	AdminUserEnums,
	SwitchStatusEnums,
} from '@/services/enums';
import type { API } from '@/services/typings';
import { appLogout, getAuthToken } from '@/utils/authToken';
import encryptTools from '@/utils/encrypt';
import { createNumberEnumsCol, createTimeCol } from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import useToken from 'antd/es/theme/useToken';
import { getExtraAuthInfo } from '../utils';
import BindRoleForm, { BindRoleSelectProps } from './components/BindRoleForm';
import GoogleCaptchaButton from './components/GoogleCaptchaButton';
import GoogleModal from './components/GoogleModal';

const SearchColWL = ['firstName', 'isValidity'];

const AdminList: React.FC = () => {
	const access = useAccess();
	const token = useToken()[1];
	const currentAdmin = useRef(getAuthToken());
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const [showGoogle, setShowGoogle] = useState(false);
	const actionRef = useRef<ActionType>();
	const [currentRow, setCurrentRow] = useState<API.AdminItem>();
	// const [selectedRowsState, setSelectedRows] = useState<API.AdminItem[]>([]);

	// 修改登录用户, 需重置全局用户数据
	const currentAdminLoginAgain = () => {
		if (
			currentRow &&
			currentAdmin.current &&
			currentRow.id === currentAdmin.current.userId
		) {
			message.info('当前登录用户信息已更改，请重新登录', 3, () => {
				appLogout();
			});
		}
	};

	/** 编辑窗口的弹窗 */
	const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
	const [onlyPWD, setOnlyPWD] = useState(false);
	const onEditFormFinish = async (
		adminInfo: API.AdminEditItem | API.AdminCreateItem
	) => {
		let success;
		const whiteIPList = adminInfo.whiteIPList;
		delete adminInfo.whiteIPList;
		const ipWhite = [...new Set(whiteIPList?.map((item) => item.ip))].join(';');
		if (adminInfo.password) {
			adminInfo.password = encryptTools.RSAencrypt(adminInfo.password);
		}
		if (adminInfo.confirmPwd) {
			adminInfo.confirmPwd = encryptTools.RSAencrypt(adminInfo.confirmPwd);
		}
		// update
		if (currentRow) {
			// 设置密码
			if (onlyPWD) {
				success = await handleAdminPWDUpdate({
					...adminInfo,
					id: currentRow.id,
				});
			} else {
				// 编辑用户信息
				success = await handleAdminUpdate(
					{
						...adminInfo,
						ipWhite,
					} as API.AdminEditItem,
					currentRow
				);
			}
			// 修改登录用户, 需重置全局用户数据
			if (success && currentRow.id === currentAdmin.current?.userId) {
				currentAdminLoginAgain();
			}
		} else {
			// create
			success = await handleAdminAdd({
				...adminInfo,
				ipWhite,
			} as API.AdminCreateItem);
		}
		// 成功后都需要关闭编辑窗口, 刷新数据
		if (success) {
			setCurrentRow(undefined);
			setOnlyPWD(false);
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
			setOnlyPWD(false);
		}
	};

	/* 绑定角色 */
	const [showBindRole, setShowBindRole] = useState(false);
	const onBindRoleCancel = () => {
		setShowBindRole(false);
		setCurrentRow(undefined);
	};
	const onBindRoleFinish = async (bindRoleInfo: API.AdminBindRoleParams) => {
		let success;
		if (currentRow) {
			success = await handleAdminBindRole(bindRoleInfo, currentRow);
			// 修改登录用户, 需重置全局用户数据
			if (success && currentRow.id === currentAdmin.current?.userId) {
				currentAdminLoginAgain();
			}
		}
		// 成功后都需要关闭编辑窗口, 刷新数据
		if (success) {
			onBindRoleCancel();
			if (actionRef.current) {
				actionRef.current.reload();
			}
		}
	};

	const columns: ProColumns<API.AdminItem>[] = (
		[
			{
				title: '用户ID',
				dataIndex: 'id',
				ellipsis: false,
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
			{
				title: '用户账号',
				dataIndex: 'firstName',
			},
			{
				title: '用户姓名',
				dataIndex: 'lastName',
			},
			createNumberEnumsCol({
				title: '启用状态',
				dataIndex: 'isValidity',
				valueEnum: SwitchStatusEnums,
				width: 120,
			}),
			{
				title: '用户邮件',
				dataIndex: 'email',
				hideInTable: true,
			},
			createNumberEnumsCol({
				title: '谷歌验证器',
				dataIndex: 'isBind',
				valueEnum: AdminGoogleBindEnums,
				hideInTable: true,
			}),
			createNumberEnumsCol({
				title: '用户类型',
				dataIndex: 'userType',
				valueEnum: AdminUserEnums,
				hideInTable: true,
			}),
			createNumberEnumsCol({
				title: '用户角色',
				dataIndex: 'roleId',
				valueType: 'select',
				request: getRoleMenuForAdmin,
				fieldProps: BindRoleSelectProps,
			}),
			{
				title: 'IP白名单',
				dataIndex: 'ipWhite',
				ellipsis: true,
			},
			createTimeCol({
				title: '创建时间',
				dataIndex: 'createTime',
				valueType: 'dateTime',
				ellipsis: false,
				width: 170,
				hideInTable: true,
			}),
			access.SYSTEM_MANAGEMENT_USER_BIND_ROLE && {
				title: '关联',
				dataIndex: 'option-roleId',
				valueType: 'option',
				width: 110,
				hideInDescriptions: true,
				render: (_, record) => {
					const { meOrNotSameLevelRecord, isRecordSuper } =
						getExtraAuthInfo(record);

					const canShow =
						access.SYSTEM_MANAGEMENT_USER_BIND_ROLE &&
						(isRecordSuper ? false : meOrNotSameLevelRecord);

					return (
						<Button
							type='primary'
							onClick={() => {
								setShowDetail(false);
								setCurrentRow(record);
								setShowBindRole(true);
							}}
							disabled={!canShow}
						>
							关联角色
						</Button>
					);
				},
			},
			access.SYSTEM_MANAGEMENT_USER_BIND_GOOGLE && {
				title: 'Google授权码',
				dataIndex: 'googleKey',
				valueType: 'option',
				width: 190,
				hideInDescriptions: true,
				render: (_, record) => {
					const isBind = record.isBind;
					const { meOrNotSameLevelRecord, isRecordSuper } =
						getExtraAuthInfo(record);
					const canShow =
						access.SYSTEM_MANAGEMENT_USER_BIND_GOOGLE && meOrNotSameLevelRecord;
					const canPreview = record.isBind && canShow;
					const canBind = canShow && !isRecordSuper;

					return [
						<Button
							key='preview'
							type='primary'
							onClick={() => {
								setShowDetail(false);
								setShowGoogle(true);
								setCurrentRow(record);
							}}
							disabled={!canPreview}
						>
							查看
						</Button>,
						<GoogleCaptchaButton
							key='google-captcha'
							disabled={!canBind}
							onClick={async () => {
								if (
									await handleAdminauthorize({
										id: record.id,
										isBind: Number(!isBind),
									})
								) {
									actionRef.current?.reload();
								}
							}}
						>
							{`${isBind ? '解绑' : '绑定'}授权码`}
						</GoogleCaptchaButton>,
					];
				},
			},
			(access.SYSTEM_MANAGEMENT_USER_02 ||
				access.SYSTEM_MANAGEMENT_USER_03 ||
				access.SYSTEM_MANAGEMENT_USER_04 ||
				access.SYSTEM_MANAGEMENT_USER_05) && {
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				fixed: 'right',
				width: 205,
				render: (_, record) => {
					const {
						isRecordSuper,
						isCurrentSuper,
						isSameLevelRecord,
						meOrNotSameLevelRecord,
						isCurrentAdmin,
					} = getExtraAuthInfo(record);

					const isEnabled = record.isValidity;
					const enableSwitchText = isEnabled ? '禁用' : '启用';
					const canShow = !isRecordSuper || isCurrentSuper;
					const canEdit =
						canShow &&
						meOrNotSameLevelRecord &&
						access.SYSTEM_MANAGEMENT_USER_03;

					const canSwitch =
						!isRecordSuper &&
						!isCurrentAdmin &&
						!isSameLevelRecord &&
						access.SYSTEM_MANAGEMENT_USER_02;

					const canChangePWD =
						canShow &&
						meOrNotSameLevelRecord &&
						access.SYSTEM_MANAGEMENT_USER_05;

					const canDelete =
						canShow &&
						!isCurrentAdmin &&
						!isSameLevelRecord &&
						access.SYSTEM_MANAGEMENT_USER_04;

					return [
						<Button
							key='config-item'
							type='link'
							onClick={() => {
								handleEditFormVisible(true);
								setCurrentRow(record);
							}}
							disabled={!canEdit}
						>
							编辑
						</Button>,
						<MyModalWrapper
							key='disable-item'
							content={`确定要${enableSwitchText}当前用户吗`}
							onFinish={async () => {
								setShowDetail(false);
								if (await handleAdminsEnable([record], Number(!isEnabled))) {
									actionRef.current?.reload?.();
									return true;
								}
							}}
						>
							<Button type='link' disabled={!canSwitch}>
								{enableSwitchText}
							</Button>
						</MyModalWrapper>,
						<Button
							key='set-pwd-item'
							onClick={() => {
								handleEditFormVisible(true);
								setCurrentRow(record);
								setOnlyPWD(true);
							}}
							type='link'
							disabled={!canChangePWD}
						>
							设置密码
						</Button>,
						<MyModalWrapper
							key='delete-item'
							content={
								<>
									确定要<span style={{ color: token.colorError }}>删除</span>
									当前用户吗
								</>
							}
							onFinish={async () => {
								setShowDetail(false);
								if (await handleAdminsRemove([record])) {
									actionRef.current?.reload?.();
									return true;
								}
							}}
						>
							<Button type='text' danger disabled={!canDelete}>
								删除
							</Button>
						</MyModalWrapper>,
					];
				},
			},
		] as ProColumns<API.AdminItem>[]
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
		<MyPageContainer>
			{access.SYSTEM_MANAGEMENT_USER_01 && (
				<MyTable<API.AdminItem, TableListPagination>
					actionRef={actionRef}
					scroll={{ x: 1400 }}
					toolBarRender={() => [
						access.SYSTEM_MANAGEMENT_USER_CREATE && (
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
					request={queryAdminList}
					columns={columns}
					/*  rowSelection={{
         onChange: (_, selectedRows) => {
           setSelectedRows(selectedRows);
         },
       }} */
				/>
			)}
			{/* <SelectionFooter
        selectedRows={selectedRowsState}
        onDelete={async () => {
          if (await handleAdminsRemove(selectedRowsState)) {
            setSelectedRows([]);
            actionRef.current?.reload?.();
          }
        }}
      /> */}
			<EditAdminForm
				open={editFormVisible}
				onlyPWD={onlyPWD}
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
					<ProDescriptions<API.AdminItem>
						column={2}
						title={currentRow.firstName}
						dataSource={currentRow}
						columns={columns as ProDescriptionsItemProps<API.AdminItem>[]}
					/>
				)}
			</Drawer>
			<GoogleModal
				open={showGoogle}
				onOpenChange={(open) => {
					if (!open) {
						setShowGoogle(false);
						setCurrentRow(undefined);
					}
				}}
				googleKey={currentRow?.googleKey!}
				googleUrl={currentRow?.googleUrl!}
				onReset={async () => {
					const result = await handleAdminauthorize({
						id: currentRow?.id!,
						isBind: 1,
					});
					if (result && currentRow) {
						actionRef.current?.reload();
						setCurrentRow({
							...currentRow!,
							...result.data,
						});
					}
					return !!result;
				}}
			/>
			<BindRoleForm
				open={showBindRole}
				initialValues={currentRow}
				onOpenChange={(visible) => {
					if (showDetail && visible) {
						setShowDetail(false);
					}
				}}
				onFinish={onBindRoleFinish}
				modalProps={{ onCancel: onBindRoleCancel }}
			/>
		</MyPageContainer>
	);
};

export default AdminList;
