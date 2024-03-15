import QuickTimeSearch, {
	QuickTimeConsts,
} from '@/components/MyDateTimePicker/QuickTimeSearch';
import { QuickTimeType } from '@/components/MyDateTimePicker/tools';
import { TextEditor } from '@/components/TextEditor';
import { queryMerchantMenu } from '@/services/api';
import { SearchTransformKeyFn } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Typography } from 'antd';
import { isEqual } from 'lodash';
import { basicMoneyFormat } from './mics';
import timeFormat, { TimeFormatConsts } from './timeFormat';

const timeSearchConfig: { transform: SearchTransformKeyFn } = {
	transform: (value) => {
		return {
			startTime: timeFormat(value[0]),
			endTime: timeFormat(value[1]),
		};
	},
};

/* 快捷时间搜索 */
export const createQuickSelectTimeCol = <T extends Record<string, any>>(
	col?: ProColumns<T>,
	config?: { defaultTimeType: QuickTimeType }
): ProColumns<T> => {
	const defaultTimeType = config?.defaultTimeType;
	return createOnlySearchCol<T>({
		dataIndex: QuickTimeConsts.FieldName,
		...col,
		...(defaultTimeType && {
			initialValue:
				defaultTimeType === QuickTimeType.Today
					? QuickTimeConsts.TodayValue
					: defaultTimeType === QuickTimeType.Yesterday
					? QuickTimeConsts.YesterdayValue
					: defaultTimeType === QuickTimeType.Week
					? QuickTimeConsts.WeekValue
					: QuickTimeConsts.MonthValue,
		}),
		renderFormItem(_, { type, defaultRender, ...props }) {
			if (type === 'form') {
				return null;
			}
			return <QuickTimeSearch {...props} {...config} />;
		},
		search: timeSearchConfig,
	});
};

/* 
  处理时间栏
*/
export const createTimeCol = <T extends Record<string, any>>(
	col: ProColumns<T>
): ProColumns<T> => {
	const isDateTime = !col.valueType || col.valueType === 'dateTime';
	const isDate = col.valueType === 'date';
	return {
		ellipsis: false,
		...col,
		render(dom, entity) {
			const dataIndex = col.dataIndex as string;
			if (!dataIndex) {
				return dom;
			}
			const time = entity[dataIndex];
			if (time) {
				return isDateTime || isDate
					? timeFormat(
							time as string,
							isDateTime ? TimeFormatConsts.DateTime : TimeFormatConsts.Date
					  )
					: dom;
			} else {
				// 处理 0001-01-01T00:00:00Z
				return '-';
			}
		},
	};
};

export const createTimeCols = <T extends Record<string, any>>(
	cols: ProColumns<T>[]
): ProColumns<T>[] => {
	return cols.map(createTimeCol);
};

export const createTimeRangeSearchCols = <T extends Record<string, any>>(
	col: ProColumns<T>,
	search?: ProColumns<T>['search']
): ProColumns<T>[] => {
	return [
		// 显示
		createTimeCol({
			...col,
			key: `show_${col.dataIndex}`,
			hideInSearch: true,
		}),
		// 搜索
		createOnlySearchCol({
			title: col.title,
			dataIndex: col.dataIndex,
			valueType: `${col.valueType}Range` as 'dateTimeRange' | 'dateRange',
			search: {
				...timeSearchConfig,
				...search,
			},
		}),
	];
};

export const createEnumsCol = <T = any,>(col: ProColumns<T>): ProColumns<T> => {
	return {
		ellipsis: false,
		...col,
	};
};

/* 
  处理数字值筛选
*/
export const createNumberEnumsCol = <T = any,>(
	col: ProColumns<T>
): ProColumns<T> => {
	return {
		...createEnumsCol<T>(col),
		search: {
			transform: (value, key) => {
				return {
					[key]: ~~value,
				};
			},
		},
	};
};

/* 
  处理搜索项目隐藏
*/
export const createOnlySearchCol = <T = any,>(
	col: ProColumns<T>
): ProColumns<T> => {
	return {
		hideInForm: true,
		hideInDescriptions: true,
		hideInTable: true,
		hideInSetting: true,
		hideInSearch: false,
		...col,
	};
};

const createShouldCellUpdate = <T extends Record<string, any>>(
	editForm: FormInstance,
	dataIndex: string,
	rowKey: string = 'id'
) => {
	return ((record, prev) => {
		if (!isEqual(record[dataIndex], prev[dataIndex])) {
			editForm?.setFieldValue(
				[record[rowKey] as string, dataIndex],
				record[dataIndex]
			);
			return true;
		}
		return false;
	}) as ProColumns<T>['shouldCellUpdate'];
};

/* 处理编辑项 */
export const createEditableCol = <T extends Record<string, any>>(
	col: ProColumns<T>,
	editForm?: FormInstance
) => {
	return {
		...(!!col.dataIndex &&
			!!editForm && {
				editable: true,
				shouldCellUpdate: createShouldCellUpdate<T>(
					editForm,
					col.dataIndex as string
				),
			}),
		ellipsis: false,
		...col,
	} as ProColumns<T, any>;
};

/* 处理使用富文本编辑的栏 */
export const createTextEditroCol = <T extends Record<string, any>>({
	title,
	dataIndex,
	...props
}: ProColumns<T>): ProColumns<T>[] => {
	return [
		{
			title: title,
			dataIndex: dataIndex,
			render(dom, entity) {
				if (dataIndex && entity[dataIndex as string]) {
					return (
						<Typography.Text
							style={{
								width: '100%',
								margin: 0,
								padding: 0,
							}}
							ellipsis={{ tooltip: '' }}
						>
							{entity[dataIndex as string]}
						</Typography.Text>
					);
				}
				return dom;
			},
			ellipsis: false,
			...props,
			hideInDescriptions: true,
		},
		{
			title: title,
			dataIndex: dataIndex,
			ellipsis: false,
			hideInTable: true,
			hideInSearch: true,
			hideInSetting: true,
			hideInForm: true,
			hideInDescriptions: false,
			valueType: 'text',
			render(dom, entity) {
				if (dataIndex && !(entity as T)[dataIndex as string]) return dom;
				return (
					<TextEditor
						value={entity[dataIndex as string]}
						readOnly
						modules={{ toolbar: null }}
						style={{ width: '100%' }}
					/>
				);
			},
			// @ts-ignore
			span: 2,
		},
	];
};

/* 处理 merchantCode 搜索栏 */
export const createMerchantCodeCol = <T extends Record<string, any>>(
	col?: ProColumns<T>
): ProColumns<T> => {
	return {
		...createOnlySearchCol({
			title: '渠道名称',
			dataIndex: 'merchantCode',
			valueType: 'select',
			request: queryMerchantMenu,
			fieldProps: {
				popupMatchSelectWidth: false,
				fieldNames: {
					label: 'merchantName',
					value: 'merchantCode',
				},
			},
		}),
		...col,
	};
};

/* 处理金额格式 */
export const createMoneyCol = <T extends Record<string, any>>(
	col: ProColumns<T>
	// currencyType: CurrencyType = CurrencyType.CNY,
): ProColumns<T> => {
	return {
		...col,
		render(dom, entity) {
			if (!col.dataIndex) {
				return dom;
			}
			const moneyList = [entity[col.dataIndex as string]].flat(1);
			return (
				moneyList
					.map((money) => {
						return basicMoneyFormat(money);
					})
					.filter(Boolean)
					.join(', ') || '-'
			);
		},
	};
};

export const createMoneyCols = <T extends Record<string, any>>(
	cols: ProColumns<T>[]
): ProColumns<T>[] => {
	return cols.map(createMoneyCol);
};
