import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput from '@/components/TrimmedInput';
import React from 'react';

import NumValueSelect from '@/components/NumValueSelect';
import { SwitchStatus, SwitchStatusEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import { validIPv4, validIPv6 } from '@/utils/mics';
import {
	ProFormList,
	ProFormText,
	type ModalFormProps,
} from '@ant-design/pro-components';
import { useForm } from 'antd/es/form/Form';

const EditAdminForm: React.FC<
	ModalFormProps<API.AdminEditItem> & { onlyPWD?: boolean }
> = ({ onlyPWD = false, ...props }) => {
	const { initialValues, ...restProps } = props;
	const isEdit = !!initialValues;
	const title = onlyPWD ? '设置密码' : isEdit ? '编辑用户' : '新增用户';
	const [form] = useForm();

	return (
		<AutoResetModalForm
			form={form}
			title={title}
			labelCol={{ span: 6 }}
			initialValues={
				initialValues && {
					...initialValues,
					whiteIPList:
						(initialValues?.ipWhite as string)?.split(';').map((ip) => ({
							ip,
						})) || [],
				}
			}
			{...restProps}
		>
			{!onlyPWD && (
				<>
					<TrimmedInput
						name='firstName'
						label='用户账号'
						rules={[{ required: true }]}
					/>
					<TrimmedInput
						name='lastName'
						label='用户姓名'
						rules={[{ required: true }]}
					/>
					<TrimmedInput
						name='email'
						label='用户邮件'
						rules={[{ required: true }, { type: 'email' }]}
					/>
					<ProFormList
						name='whiteIPList'
						label='IP白名单'
						tooltip='0.0.0.0表示放行全部'
						creatorButtonProps={{
							creatorButtonText: '添加IP地址',
						}}
						required={isEdit}
						rules={
							isEdit
								? [
										{
											required: true,
											validator(_, value) {
												const ipList = value
													.map((item: any) => item?.ip)
													?.filter(Boolean);
												// console.log('value => ', value, ipList);
												const length = ipList?.length;
												if (length) {
													return Promise.resolve();
												}
												return Promise.reject('请输入至少一个IP地址');
											},
										},
								  ]
								: undefined
						}
						copyIconProps={false}
					>
						<ProFormText
							name='ip'
							placeholder='0.0.0.0表示放行全部'
							rules={[
								{ required: true, message: '请输入IP地址或者删除该行' },
								{
									validator(_, value) {
										if (!value || validIPv4(value) || validIPv6(value)) {
											if (value) {
												const whiteIPList = form
													.getFieldValue('whiteIPList')
													?.map((item: any) => item.ip);
												if (whiteIPList.length > new Set(whiteIPList).size) {
													return Promise.reject('请不要重复输入IP地址');
												}
											}
											return Promise.resolve();
										}
										return Promise.reject('请输入正确的IP地址');
									},
								},
							]}
						/>
					</ProFormList>
				</>
			)}

			{(onlyPWD || !isEdit) && (
				<>
					<TrimmedInput.Password
						name='password'
						label='登录密码'
						rules={[
							{ required: onlyPWD || !isEdit, message: '请填写用户登录密码' },
						]}
					/>
					<TrimmedInput.Password
						name='confirmPwd'
						label='确认密码'
						rules={[
							{
								required: onlyPWD || !isEdit,
								message: '请再次输入密码!',
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('两次密码不一致'));
								},
							}),
						]}
					/>
				</>
			)}
			{!onlyPWD && (
				<NumValueSelect
					name='isValidity'
					label='状态'
					rules={[{ required: true }]}
					valueEnum={SwitchStatusEnums}
					initialValue={SwitchStatus.Open}
				/>
			)}
		</AutoResetModalForm>
	);
};

export default EditAdminForm;
