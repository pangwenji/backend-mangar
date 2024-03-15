import AutoResetModalForm from '@/components/AutoResetModalForm';
import React from 'react';

import MyDigitInput from '@/components/MyDigitInput';
import type { API } from '@/services/typings';
import { type ModalFormProps } from '@ant-design/pro-components';
import { useForm } from 'antd/es/form/Form';

const EditGameQuotaForm: React.FC<ModalFormProps<API.GameQuotaEditItem>> = ({
	...props
}) => {
	const { initialValues, ...restProps } = props;
	const isEdit = !!initialValues;
	const title = isEdit ? '编辑' : '新增';
	const [form] = useForm();
	return (
		<AutoResetModalForm
			title={title}
			initialValues={initialValues}
			labelCol={{ span: 5 }}
			labelAlign='right'
			form={form}
			{...restProps}
		>
			<MyDigitInput
				fieldProps={{ precision: 2 }}
				name='returnPointRatio'
				label='返水'
				rules={[{ required: true }]}
				max={100}
			/>
			<MyDigitInput
				fieldProps={{ precision: 2 }}
				name='singleMinLimit'
				label='单注最小'
				rules={[
					{ required: true },
					{
						validator(_, value) {
							const maxLimit = form.getFieldValue('singleMaxLimit');
							if (maxLimit && typeof value === 'number' && maxLimit < value) {
								return Promise.reject(
									new Error('[单注最小]不得大于[单注最高]')
								);
							}
							return Promise.resolve();
						},
					},
				]}
			/>
			<MyDigitInput
				fieldProps={{ precision: 2 }}
				name='singleMaxLimit'
				label='单注最高'
				rules={[
					{ required: true },
					{
						validator(_, value) {
							const singleMax = form.getFieldValue('singleIssueLimit');
							if (singleMax && typeof value === 'number' && singleMax < value) {
								return Promise.reject(
									new Error('[单注最高]不得大于[单期最高]')
								);
							}
							return Promise.resolve();
						},
					},
				]}
			/>
			<MyDigitInput
				fieldProps={{ precision: 2 }}
				name='singleIssueLimit'
				label='单期最高'
				rules={[{ required: true }]}
			/>
			<MyDigitInput
				fieldProps={{ precision: 2 }}
				name='drawWaterRatio'
				label='抽水'
				rules={[{ required: true }]}
				max={100}
			/>
			<MyDigitInput
				fieldProps={{ precision: 2 }}
				name='maxReward'
				label='最高赔付'
				rules={[{ required: true }]}
			/>
		</AutoResetModalForm>
	);
};

export default EditGameQuotaForm;
