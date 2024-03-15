import { getObjectPrototype } from '@/utils/mics';
import type {
	ProColumns,
	ProSchemaValueEnumType,
} from '@ant-design/pro-components';
import type { SelectProps } from 'antd';
import { Badge, Select } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import React, { memo, useEffect, useState } from 'react';

interface IMySelectProps extends SelectProps {
	request?: () => Promise<DefaultOptionType[]>;
	valueEnum?: ProColumns['valueEnum'];
	isNumber?: boolean;
}

const MySelect: React.FC<IMySelectProps> = ({
	children,
	request,
	valueEnum,
	isNumber = false,
	onChange,
	value,
	...props
}) => {
	const [options, setOptions] = useState<DefaultOptionType[]>([]);
	const [loading, setLoading] = useState(!!request);
	useEffect(() => {
		if (valueEnum) {
			const parsedOptions = Object.entries(valueEnum).map(([id, config]) => {
				if (getObjectPrototype(config) === 'Object') {
					return {
						value: id,
						label: (
							<Badge
								status={
									((
										config as ProSchemaValueEnumType
									).status?.toLowerCase() as any) || 'default'
								}
								text={(config as ProSchemaValueEnumType).text}
							/>
						),
					};
				} else {
					return { value: id, label: config };
				}
			});
			setOptions(parsedOptions);
		} else if (request) {
			request?.()
				.then((opts) => {
					setOptions(opts);
				})
				.catch(() => {})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [request, valueEnum]);

	const handleOnChange: SelectProps['onChange'] = (changeVal, ...params) => {
		const parsedValue = isNumber ? ~~changeVal : changeVal;
		onChange?.(parsedValue, ...params);
	};
	return (
		<Select
			{...props}
			value={
				valueEnum ? (typeof value === 'undefined' ? value : `${value}`) : value
			}
			onChange={handleOnChange}
			loading={loading}
			options={props?.options?.length ? props.options : options}
		>
			{children}
		</Select>
	);
};
export default memo(MySelect);
