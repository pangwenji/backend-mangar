import AutoResetModalForm from '@/components/AutoResetModalForm';
import React from 'react';

import NumValueSelect from '@/components/NumValueSelect';
import TrimmedInput from '@/components/TrimmedInput';
import type { API } from '@/services/typings';
import { type ModalFormProps } from '@ant-design/pro-components';

const BannedDays = [1, 3, 7, 15, 30, 180, -1];
export const BannedDaysEnum = BannedDays.reduce((res, days) => {
	return {
		...res,
		[days]: days === -1 ? '永久禁言' : days,
	};
}, {} as Record<any, string>);

const EditMemberBanForm: React.FC<ModalFormProps<API.MemberBanEditItem>> = ({
	...props
}) => {
	const { initialValues, ...restProps } = props;
	return (
		<AutoResetModalForm
			title='新增禁言'
			initialValues={initialValues}
			labelCol={{ span: 7 }}
			{...restProps}
		>
			<TrimmedInput
				name='accountName'
				label='会员账号'
				rules={[{ required: true }]}
			/>
			<NumValueSelect
				name='days'
				label='禁言期限(天)'
				valueEnum={BannedDaysEnum}
				rules={[{ required: true }]}
			/>
		</AutoResetModalForm>
	);
};

export default EditMemberBanForm;
