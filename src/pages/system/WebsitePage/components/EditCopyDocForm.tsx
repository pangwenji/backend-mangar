import AutoResetModalForm from '@/components/AutoResetModalForm';
import React from 'react';

import { FormTextEditor } from '@/components/TextEditor';
import type { API } from '@/services/typings';
import { type ModalFormProps } from '@ant-design/pro-components';

const EditCopyDocForm: React.FC<
	ModalFormProps<API.CopyItem> & { isPlayDoc: boolean }
> = ({ initialValues, isPlayDoc, ...restProps }) => {
	const isEdit = !!initialValues;
	const title =
		(isEdit ? '编辑' : '新增') + (isPlayDoc ? '玩法说明' : '游戏赔率');

	return (
		<AutoResetModalForm
			title={title}
			initialValues={{
				...initialValues,
				playDoc: initialValues?.playDoc || '',
				oddDoc: initialValues?.oddDoc || '',
			}}
			width={600}
			labelCol={{ span: 3 }}
			{...restProps}
		>
			<FormTextEditor name={isPlayDoc ? 'playDoc' : 'oddDoc'} />
		</AutoResetModalForm>
	);
};

export default EditCopyDocForm;
