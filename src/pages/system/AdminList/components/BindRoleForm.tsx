import AutoResetModalForm from '@/components/AutoResetModalForm';
import React from 'react';

import { getRoleMenuForAdmin } from '@/services/api';
import type { API } from '@/services/typings';
import { SUPER_ADMIN_ID } from '@/utils/consts';
import { ProFormSelect, type ModalFormProps } from '@ant-design/pro-components';

export const BindRoleSelectProps = {
	popupMatchSelectWidth: false,
	fieldNames: {
		label: 'browsersName',
		value: 'serverCode',
	},
};

const BindRoleForm: React.FC<ModalFormProps<API.AdminBindRoleParams>> = ({
	initialValues,
	...restProps
}) => {
	return (
		<AutoResetModalForm
			title='关联角色'
			initialValues={{
				...initialValues,
				roleId: initialValues?.roleId && String(initialValues?.roleId),
			}}
			{...restProps}
		>
			<ProFormSelect
				name='roleId'
				label='关联角色'
				rules={[{ required: true }]}
				request={async () => {
					const data = await getRoleMenuForAdmin();
					// 过滤超管角色
					return data.filter(
						(role) => Number(role.serverCode) !== SUPER_ADMIN_ID
					);
				}}
				fieldProps={BindRoleSelectProps}
			/>
		</AutoResetModalForm>
	);
};

export default BindRoleForm;
