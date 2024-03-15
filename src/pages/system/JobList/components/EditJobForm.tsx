import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput, { TrimmedTextArea } from '@/components/TrimmedInput';
import React from 'react';

import MyDigitInput from '@/components/MyDigitInput';
import MyJSONEditor from '@/components/MyJSONEditor';
import NumValueSelect from '@/components/NumValueSelect';
import { SwitchStatus } from '@/services/enums';
import type { API } from '@/services/typings';
import {
	ProForm,
	ProFormSwitch,
	type ModalFormProps,
} from '@ant-design/pro-components';
import { Col } from 'antd';
const CommonRules = [{ required: true }];

export const IsFirstEnums = {
	[SwitchStatus.Close]: '否',
	[SwitchStatus.Open]: '是',
};

const EditJobForm: React.FC<ModalFormProps<API.JobEditItem>> = (props) => {
	const { initialValues, ...restProps } = props;
	const isEdit = !!initialValues;
	const title = isEdit ? '编辑任务' : '新增任务';

	return (
		<AutoResetModalForm
			title={title}
			initialValues={initialValues}
			width={660}
			labelCol={{ span: 6 }}
			labelAlign='left'
			style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
			{...restProps}
		>
			<TrimmedInput name='enumName' label='平台编码' rules={CommonRules} />
			<TrimmedInput name='jobName' label='名称' rules={CommonRules} />
			<MyDigitInput name='weight' label='权重' rules={CommonRules} />
			<TrimmedInput name='jobHandler' label='KEY' rules={CommonRules} />
			<TrimmedInput
				name='url'
				label='URL'
				rules={[...CommonRules, { type: 'url' }]}
			/>
			<TrimmedInput name='periodsNumber' label='期号' />
			<TrimmedInput name='drawingResult' label='开奖号码' />
			<TrimmedInput name='drawingDate' label='开奖时间' />
			<TrimmedInput name='jsonArrayKey' label='数组名称' />
			<TrimmedInput name='jsonObjectKey' label='对象名称' />
			<NumValueSelect
				name='isFirst'
				label='是否可以作为第一期'
				allowClear={false}
				valueEnum={IsFirstEnums}
				initialValue={SwitchStatus.Open}
			/>
			<TrimmedInput name='code' label='响应代码' />
			<TrimmedInput name='msg' label='提示代码' />
			<TrimmedInput name='codeValue' label='响应成功值' />
			<TrimmedInput name='msgValue' label='提示成功值' />
			<Col span={24}>
				<ProForm.Item name='param' label='额外参数' style={{ flex: 1 }}>
					<MyJSONEditor mode='code' />
				</ProForm.Item>
			</Col>
			<TrimmedTextArea name='remark' label='备注' />
			<ProFormSwitch
				name='isValidity'
				label='开关'
				fieldProps={{ checkedChildren: '开', unCheckedChildren: '关' }}
				initialValue={1}
				convertValue={(value) => {
					return Boolean(value);
				}}
				transform={(value, name) => {
					return {
						[name]: Number(value),
					};
				}}
			/>
		</AutoResetModalForm>
	);
};

export default EditJobForm;
