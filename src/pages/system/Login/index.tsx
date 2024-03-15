import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import { Button, Image, message, Spin, Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import TrimmedInput from '@/components/TrimmedInput';
import { adminLogin, getCaptcha } from '@/services/api';
import { clearAuthToken, setAuthToken } from '@/utils/authToken';
import { ProForm, SubmitterProps } from '@ant-design/pro-components';

import type { API } from '@/services/typings';

import encryptTools from '@/utils/encrypt';
import {
	getLoginContainerClassName,
	loginFormClassName,
	loginFormWrapper,
} from './styles';

const { Text, Title } = Typography;
const RequiredRules = [
	{
		required: true,
	},
];
const GoogleCodeReg = /^\d{6}$/;
const SubmitterConfig: SubmitterProps = {
	resetButtonProps: false,
	submitButtonProps: {
		style: { alignSelf: 'center' },
		// disabled: true,
	},
	searchConfig: {
		submitText: '登录',
	},
};

const Login: React.FC = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const [captcha, setCaptcha] = useState('');
	const [captchaLoading, setCaptchaLoading] = useState(true);
	const [browserFingerprint, setBrowserFingerprint] = useState<string>();
	const captchaRef = useRef<HTMLButtonElement>(null);

	const containerClassName = useEmotionCss(getLoginContainerClassName);

	const fetchAdminInfo = async () => {
		const [authRuleList] = await Promise.all([
			initialState?.fetchMyMenuList?.(),
		]);
		if (authRuleList) {
			flushSync(() => {
				setInitialState((s) => ({
					...s,
					...authRuleList,
				}));
			});
		}
	};

	const handleSubmit = async (
		values: Omit<API.LoginParams, 'browserFingerprint'>
	) => {
		try {
			// 登录
			const result = await adminLogin({
				...values,
				password: encryptTools.RSAencrypt(values.password),
				browserFingerprint,
			});
			const { data } = result;
			setAuthToken(data as API.LoginData);
			await fetchAdminInfo();
			message.success('登录成功！');
			const urlParams = new URL(window.location.href).searchParams;
			history.push(urlParams.get('redirect') || '/');
			return;
		} catch (error: any) {
			clearAuthToken();
			captchaRef.current?.click();
			// const defaultLoginFailureMessage = '登录失败，请重试！';
			// message.error(defaultLoginFailureMessage);
		}
	};
	const handleGetCaptcha = useCallback(async () => {
		setCaptchaLoading(true);
		const vid = uuidv4();
		try {
			const data = await getCaptcha(vid);
			setCaptcha(window.URL.createObjectURL(data));
			setBrowserFingerprint(vid);
		} catch {
		} finally {
			setCaptchaLoading(false);
		}
	}, []);
	const handleCaptchLoad = () => {
		captcha && window.URL.revokeObjectURL(captcha);
	};
	useEffect(() => {
		if (captchaRef.current) {
			captchaRef.current.click();
		}
	}, []);

	return (
		<div className={containerClassName}>
			<Helmet>
				<title>{initialState?.settings?.title}</title>
			</Helmet>
			{/* <ImageWithFallback
        src={loginBG}
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'cover',
        }}
        preview={false}
        rootClassName='login-page-bg'
      /> */}
			<div className={loginFormWrapper}>
				<div className='login-form-title'>
					<Title>后台登录</Title>
					<Text>欢迎回来！</Text>
				</div>
				<ProForm
					rootClassName={loginFormClassName}
					onFinish={handleSubmit}
					submitter={SubmitterConfig}
				>
					<TrimmedInput
						name='username'
						label='账户'
						placeholder='请输入账户'
						rules={RequiredRules}
					/>
					<TrimmedInput.Password
						name='password'
						label='密码'
						placeholder='请输入密码'
						rules={RequiredRules}
						closeDefaultRules
					/>
					<TrimmedInput
						name='verificationCode'
						label='验证码'
						placeholder='请输入验证码'
						rules={RequiredRules}
						fieldProps={{
							addonAfter: (
								<Button
									type='text'
									disabled={captchaLoading && !!captcha}
									ref={captchaRef}
									onClick={handleGetCaptcha}
								>
									{!captchaLoading && captcha ? (
										<Image
											src={captcha}
											preview={false}
											onLoad={handleCaptchLoad}
										/>
									) : (
										<Spin />
									)}
								</Button>
							),
						}}
					/>
					<TrimmedInput
						name='googleCode'
						label='Google验证码'
						placeholder='请输入Google验证码'
						rules={[
							...RequiredRules,
							{
								pattern: GoogleCodeReg,
								message: '请输入正确的Google验证码',
							},
						]}
					/>
				</ProForm>
				<span className='login-form-footer'>© {new Date().getFullYear()}</span>
			</div>
		</div>
	);
};
export default Login;
