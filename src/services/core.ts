import { appLogout, getAuthToken } from '@/utils/authToken';
import type {
	AxiosError,
	RequestConfig,
	ResponseInterceptor,
} from '@umijs/max';
import { message, notification } from 'antd';
import type { RequestInterceptor } from 'umi-request';
import { ApiUrls } from './api';
import { API } from './typings';

// 错误处理方案： 错误类型
export enum ErrorShowType {
	SILENT = 0,
	WARN_MESSAGE = 1,
	ERROR_MESSAGE = 2,
	NOTIFICATION = 3,
	REDIRECT = 9,
}

const FORCE_LOOUT_CODES = [10023, 10017, 10022]; // 强制登出 code
let hasLogout = false; // 记录是否已经调用登出， 防止重复登出
let hasNotTokenChecked = false;
const NoTokenError = 'ADMIN_WEB_NO_REQUEST_TOKEN'; // 防止前端 token 丢失

// 与后端约定的响应数据格式
type ResponseStructure = API.CommonData<any>;

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
const errorConfig: RequestConfig['errorConfig'] = {
	// 错误抛出
	errorThrower: (res: any) => {
		const { message: msg, success } = res as unknown as ResponseStructure;
		if (!success) {
			const error: any = new Error(msg || '请求出错');
			error.name = 'BizError';
			error.info = { ...res };
			throw error; // 抛出自制的错误
		}
	},
	// 错误接收及处理
	errorHandler: (error: any, opts: any) => {
		if (opts?.skipErrorHandler) throw error;
		let errorMsg = '';
		let errorCode: number | string | undefined;
		console.log('error Info => ', error, opts);
		// errorThrower 抛出的错误。
		if (error.message === NoTokenError && !hasNotTokenChecked) {
			hasNotTokenChecked = true;
			message.error('用户数据缺失，请重新登录', 3, () => {
				appLogout();
			});
			return;
		} else if (error.name === 'BizError') {
			const errorInfo: ResponseStructure | undefined =
				error.response?.data || error.info;
			if (errorInfo) {
				const { message: msg, code } = errorInfo;
				// 强制登出处理
				const needLogout = FORCE_LOOUT_CODES.includes(code);
				if (needLogout) {
					if (!hasLogout) {
						appLogout();
						// 强制登出时，强制报错
						opts.showType = ErrorShowType.ERROR_MESSAGE;
						hasLogout = true;
					} else {
						return;
					}
				}
				errorMsg = msg || '';
				errorCode = code;
				// console.log('error Info => ', msg, code, opts);
			}
		} else if (error.response) {
			// Axios 的错误
			// 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
			errorMsg = `${(error as AxiosError).config.url}: Response status ${
				error.response.status
			} ${
				error.msg || error.message || (error as AxiosError).response?.statusText
			}`;
			errorCode = (error as AxiosError).response?.status;
		} else {
			errorMsg = `${(error as AxiosError).config.url}: ${
				error.msg || error.message
			}`;
			errorCode = (error as AxiosError).status;
		}

		switch (opts.showType) {
			case ErrorShowType.SILENT:
				// do nothing
				break;
			case ErrorShowType.WARN_MESSAGE:
				message.warning(errorMsg);
				break;
			case ErrorShowType.ERROR_MESSAGE:
				message.error(errorMsg);
				break;
			case ErrorShowType.NOTIFICATION:
				notification.open({
					description: errorMsg,
					message: errorCode,
				});
				break;
			case ErrorShowType.REDIRECT:
				// TODO: redirect
				break;
			default:
				message.error(errorMsg);
		}
		throw error;
	},
};

// 无需添加 Authorization 的 api
const TokenHeadersBlackList: string[] = [ApiUrls.Login, ApiUrls.Captcha];
// 无需拼接路径 api
const NoMGTList = [...TokenHeadersBlackList, ApiUrls.Logout];

// 统一添加请求头 Authorization 和路径前缀
const handleAuthorization: RequestInterceptor = (url, options) => {
	const joinedUrl = NoMGTList.includes(url) ? url : MGT_API_PREFIX + url;
	if (TokenHeadersBlackList.includes(url)) {
		return { url: joinedUrl, options };
	} else {
		const authToken = getAuthToken()?.token;
		if (!authToken) {
			throw new Error(NoTokenError);
		}
		const headers = {
			...options.headers,
			Authorization: `Bearer ${getAuthToken()?.token}`,
		};
		return {
			url: joinedUrl,
			options: {
				...options,
				headers,
			},
		};
	}
};

// 统一处理错误
const handleResponseError: ResponseInterceptor = (response) => {
	// 拦截响应数据，进行个性化处理
	const { data } = response;
	// 登录后重置登出标记
	if (response.config.url === ApiUrls.Login) {
		hasLogout = false;
		hasNotTokenChecked = false;
	}
	if (data && response.config.responseType !== 'blob') {
		errorConfig.errorThrower?.(data);
	}
	return response;
};

// 判断部署地址
const isHttps = new URL(window.location.href).protocol === 'https:';
/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export default {
	baseURL: isHttps && HTTPS_API_URL ? HTTPS_API_URL : API_URL,
	timeout: 10000,
	errorConfig,
	// 请求拦截器
	requestInterceptors: [handleAuthorization],
	// 响应拦截器
	responseInterceptors: [handleResponseError],
} as RequestConfig;
