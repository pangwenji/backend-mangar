import { AppRoutePath } from '@/../config/routes';
import { adminLogout } from '@/services/api';
import { message } from 'antd';
import { stringify } from 'querystring';
import { history } from 'umi';

import type { API } from '@/services/typings';

export const LoginPath = AppRoutePath.Login;

export const isLoginPage = () => {
	const { location } = history;
	const second = location.pathname.indexOf('/');
	const subpath = location.pathname.slice(second);
	if (subpath.startsWith(LoginPath)) return true;
	return false;
};

const AUTH_TOKEN_KEY = 'ADMIN_TOKEN';
export const setAuthToken = (data: API.LoginData) =>
	window.localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(data));

export const clearAuthToken = () =>
	window.localStorage.removeItem(AUTH_TOKEN_KEY);

export const getAuthToken = () => {
	const data = window.localStorage.getItem(AUTH_TOKEN_KEY);
	return typeof data === 'string' ? (JSON.parse(data) as API.LoginData) : data;
};

/**
 * 退出登录，并且将当前的 url 保存
 * 前端直接删除 token 实现退出登陆
 *
 */
export const appLogout = async () => {
	if (getAuthToken()) {
		const hide = message.loading('登出中...');
		try {
			await adminLogout();
		} catch (err: any) {
		} finally {
			clearAuthToken();
			hide();
		}
	}
	// 登录页不处理
	if (isLoginPage()) return false;
	const { location } = history;
	const slashIndex = location.pathname.indexOf('/');
	const subpath = location.pathname.slice(slashIndex);
	const { search } = location;
	const urlParams = new URL(window.location.href).searchParams;
	/** 此方法会跳转到 redirect 参数所在的位置 */
	const redirect = urlParams.get('redirect');
	history.replace({
		pathname: LoginPath,
		search: stringify({
			redirect: redirect || subpath + search,
		}),
	});
	return true;
};

/**
 * 登陆后的页面跳转
 *
 */
export const loginJump = () => {
	/** 此方法会跳转到 redirect 参数所在的位置 */
	const urlParams = new URL(window.location.href).searchParams;
	/** 此方法会跳转到 redirect 参数所在的位置 */
	const redirect = urlParams.get('redirect');
	history.push(redirect ? redirect : '/');
};
