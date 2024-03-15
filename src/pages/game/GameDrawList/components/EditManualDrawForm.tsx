import AutoResetModalForm from '@/components/AutoResetModalForm';
import React, { useEffect, useState } from 'react';

import TrimmedInput from '@/components/TrimmedInput';
import {
	ProFormDependency,
	ProFormSelect,
	SearchTransformKeyFn,
	type ModalFormProps,
} from '@ant-design/pro-components';
import { Button, Col, Typography } from 'antd';
import { Rule } from 'antd/es/form';
import { useForm } from 'antd/es/form/Form';
import { SelectProps } from 'antd/lib';

const { Text } = Typography;

export const enum ManualDrawType {
	Manual = 'Manual',
	Skip = 'Skip',
}

export const ManualDrawTypeEnum = {
	[ManualDrawType.Manual]: '手动开奖',
	[ManualDrawType.Skip]: '跳过这期',
};
export type EditManulDrawType = {
	drawingResult?: string;
	manualType: ManualDrawType;
};

const ResultReg = /^(\x20?\d+\x20?)+$/;

const ResultRules: Rule[] = [
	{ required: true },
	{
		validator(_, value) {
			const trimmedValue = value?.trim?.();
			if (trimmedValue && !ResultReg.test(trimmedValue)) {
				return Promise.reject('请输入正确的开奖结果');
			}
			return Promise.resolve();
		},
	},
];

const ResultTransform: SearchTransformKeyFn = (val, name) => {
	return {
		[name]: val?.trim?.().replace(/\s+/g, ','),
	};
};

const EditManualDrawForm: React.FC<ModalFormProps<EditManulDrawType>> = ({
	submitter,
	...props
}) => {
	const [form] = useForm();

	const [type, setType] = useState<ManualDrawType>(ManualDrawType.Manual);
	const handleTypeChange: SelectProps<ManualDrawType>['onChange'] = (value) => {
		setType(value);
	};
	const [nextStep, setNextStep] = useState(false);
	const handleNextStep = async () => {
		try {
			await form.validateFields();
			setNextStep(true);
		} catch {}
	};
	// 重置
	useEffect(() => {
		return () => {
			setType(ManualDrawType.Manual);
			setNextStep(false);
		};
	}, [props.open]);

	return (
		<AutoResetModalForm
			title='手动开奖'
			colProps={{ span: 24 }}
			width={550}
			form={form}
			{...props}
			submitter={
				!nextStep && type === ManualDrawType.Manual
					? {
							render(_, dom) {
								return [
									<Button type='primary' ghost onClick={handleNextStep}>
										下一步
									</Button>,
									dom[0],
								];
							},
					  }
					: undefined
			}
		>
			<ProFormSelect
				valueEnum={ManualDrawTypeEnum}
				name='manualType'
				label='操作类型'
				rules={[{ required: true }]}
				fieldProps={{ allowClear: false }}
				initialValue={type}
				onChange={handleTypeChange}
				hidden={nextStep}
			/>
			<ProFormDependency name={['manualType']}>
				{({ manualType }) => {
					if (manualType === ManualDrawType.Manual) {
						return (
							<TrimmedInput
								label='开奖结果'
								name='drawingResult'
								tooltip='输入数字请用空格隔开'
								placeholder='输入数字请用空格隔开'
								rules={ResultRules}
								disabled={nextStep}
								transform={ResultTransform}
							/>
						);
					} else if (manualType === ManualDrawType.Skip) {
						return (
							<Col offset={5}>
								<Text type='danger'>点击确认下一期将正常开售。</Text>
							</Col>
						);
					} else {
						return null;
					}
				}}
			</ProFormDependency>
		</AutoResetModalForm>
	);
};

export default EditManualDrawForm;
