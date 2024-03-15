import AutoResetModalForm from '@/components/AutoResetModalForm';
import MyDigitInput from '@/components/MyDigitInput';
import { API } from '@/services/typings';
import { ProFormRadio, type ModalFormProps } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { CheckboxOptionType } from 'antd';
import { omit } from 'lodash';
import React from 'react';

export const enum EditOddType {
	Multi = 1,
	Single,
}

type EditOddFormProps = Omit<
	ModalFormProps<API.GameOddEditItem>,
	'onFinish'
> & {
	onFinish: (item: API.GameOddEditItem, type: EditOddType) => Promise<void>;
};

// 不能为负数
const EditOddForm: React.FC<EditOddFormProps> = ({ ...props }) => {
	const { initialValues, onFinish, ...restProps } = props;
	const access = useAccess();
	const options = (
		[
			access.GAME_MANAGEMENT_03_UPDATE && {
				label: '独立',
				value: EditOddType.Single,
			},
			access.GAME_MANAGEMENT_03_UPDATE_BATCH && {
				label: '批量',
				value: EditOddType.Multi,
			},
		] as CheckboxOptionType[]
	).filter(Boolean);

	return (
		<AutoResetModalForm
			className='edit-odd-form'
			title={`编辑[${initialValues?.playTypeName}-${initialValues?.playName}]赔率`}
			width={438}
			initialValues={initialValues}
			layout='horizontal'
			onFinish={(fields) => {
				return onFinish(
					omit(fields, 'editType') as API.GameOddEditItem,
					fields.editType
				);
			}}
			{...restProps}
		>
			<MyDigitInput
				name='odds'
				label='赔率'
				rules={[{ required: true }]}
				fieldProps={{ precision: 3 }}
				colProps={{ flex: 'auto' }}
			/>
			<ProFormRadio.Group
				name='editType'
				// label='editType'
				radioType='button'
				fieldProps={{ buttonStyle: 'solid' }}
				initialValue={options[0]?.value}
				options={options}
				colProps={{ span: 8 }}
			/>
		</AutoResetModalForm>
	);
};

export default EditOddForm;
