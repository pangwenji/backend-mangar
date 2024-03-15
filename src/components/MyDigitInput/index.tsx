import { ProFormDigit, ProFormText } from '@ant-design/pro-components';
import type { ProFormDigitProps } from '@ant-design/pro-form/es/components/Digit';
import type { InputNumberProps } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React, { memo } from 'react';
import { TrimmedInputProps } from '../TrimmedInput';

const MyDigitInput: React.FC<ProFormDigitProps> = ({
	fieldProps,
	...props
}) => {
	const min = props.min || 0;
	const formInstance = useFormInstance();

	const handleOnChange: InputNumberProps<number>['onChange'] = (val) => {
		if (props.name && (val === undefined || val === null)) {
			formInstance?.setFieldsValue({
				[props.name as string]: min,
			});
		}
		fieldProps?.onChange?.(val);
	};

	return (
		<ProFormDigit
			fieldProps={{ precision: 0, ...fieldProps, onChange: handleOnChange }}
			min={0}
			{...props}
		/>
	);
};
export default memo(MyDigitInput);

const fixNumberVal = (value: string | null | undefined, min: number) => {
	const val = value?.trim();
	const numVal = Number(val);
	if (Number.isNaN(numVal)) {
		return `${min}`;
	} else {
		return `${numVal < min ? min : numVal}`;
	}
};

export const MyNumberInput: React.FC<TrimmedInputProps & { min?: number }> =
	memo(({ min = 0, ...props }) => {
		const form = useFormInstance();
		const { fieldProps = {}, name } = props;
		const { onBlur } = fieldProps;

		const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
			if (name) {
				const value = form.getFieldValue(name);
				if (typeof value === 'string') {
					form.setFieldsValue({ [name as string]: fixNumberVal(value, min) });
				} else if (Array.isArray(value)) {
					form.setFieldsValue({
						[name as string]: value.map((item) => {
							return fixNumberVal(item, min);
						}),
					});
				}
			}
			onBlur?.(e);
		};

		return (
			<ProFormText
				{...props}
				name={name}
				fieldProps={{
					...fieldProps,
					onBlur: handleBlur,
				}}
			/>
		);
	});
