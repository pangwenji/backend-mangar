import { ProTableRequest, ProTableRequestParams } from '@/pages/typings';
import { request } from 'umi';

import { ReportQUickTimeSearchID } from '@/components/MyDateTimePicker/ReportQuickTimeSearch';
import { UploadFile } from 'antd';
import { ErrorShowType } from './core';
import { SwitchStatus } from './enums';
import type { API } from './typings';

export const ApiUrls = {
	Captcha: '/scy/verificationCode',
	Login: '/scy/login',
	Logout: '/scy/logout',
};

const parseListParams = (params?: ProTableRequestParams) => {
	if (!params) return {};
	const size = params.pageSize;
	const otherParams = { ...params };
	delete otherParams.pageSize;
	delete otherParams.total;
	delete otherParams[ReportQUickTimeSearchID];
	return {
		size,
		...otherParams,
	};
};

const parseListResponse = <T>({
	records,
	...props
}: API.CommonListResult<T>) => {
	return {
		data: records || [],
		success: true,
		...props,
	};
};

const parseSummaryListResponse = <T, Summary>({
	pageInfo,
	sumInfo,
}: API.CommonSummayResult<T, Summary>) => {
	const { records, ...otherPageInfo } = pageInfo;
	return {
		data: records || [],
		...otherPageInfo,
		sumInfo,
		success: true,
	};
};

const createFileFormData = (
	data: Record<string, any>,
	urlFileList: { urlName: string; fileName: string }[] = [
		{ urlName: 'iconUrl', fileName: 'file' },
	]
) => {
	const parsedData = { ...data };
	urlFileList.forEach((config) => {
		if (
			typeof parsedData[config.urlName] === 'object' &&
			(parsedData[config.urlName] as UploadFile)?.uid
		) {
			parsedData[config.fileName] = (
				parsedData[config.urlName] as UploadFile
			).originFileObj;
		}
		if (parsedData[config.urlName]) {
			delete parsedData[config.urlName];
		}
	});

	const fd = new FormData();
	Object.entries(parsedData).forEach(([key, value]) => {
		fd.append(key, typeof value === 'number' ? `${value}` : value);
	});
	return fd;
};

// START 系统字典 -----

/** 获取彩票菜单 GET /menu/findLotteryClassMenu */
export const queryLotteryMenu = async () => {
	const { data } = await request<API.CommonData<API.LotteryItem[]>>(
		'/menu/findLotteryClassMenu',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 获取游戏类型菜单 GET /menu/findGameTypeMenu */
export const queryGameTypeMenu = async () => {
	const { data } = await request<API.CommonData<API.GameTypeMenu[]>>(
		'/menu/findGameTypeMenu',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 获取游戏菜单 GET /menu/findGameName */
export const queryGameMenu = async () => {
	const { data } = await request<API.CommonData<API.GameMenu[]>>(
		'/menu/findGameName',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 获取交易类型菜单 GET /menu/findTradeName */
export const queryTradeTypeMenu = async () => {
	const { data } = await request<API.CommonData<API.TradeType[]>>(
		'/menu/findTradeName',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 获取玩法菜单 GET /menu/findPlayMenu */
export const queryPlayTypeMenu = async (params: { lotteryCode: string }) => {
	const { data } = await request<API.CommonData<API.GamePlayType[]>>(
		'/menu/findPlayMenu',
		{
			method: 'GET',
			params,
		}
	);
	return data;
};

/** 查询二级玩法菜单 GET /menu/findSubPlayMenu */
export const querySubPlayTypeMenu = async (params: {
	lotteryCode: string;
	playTypeCode: string;
}) => {
	const { data } = await request<API.CommonData<API.SubGamePlayType[]>>(
		'/menu/findSubPlayMenu',
		{
			method: 'GET',
			params,
		}
	);
	return data;
};

/** 查询三方信息(厂商/渠道/商户...)下拉菜单 GET /menu/findMerchantInfo */
export const queryMerchantMenu = async () => {
	const { data } = await request<API.CommonData<API.MerchantInfo[]>>(
		'/menu/findMerchantInfo',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 查询盘口下拉菜单 GET /menu/findHandicap */
export const queryHandicappMenu = async (params: { lotteryCode: string }) => {
	const { data } = await request<API.CommonData<API.HandicapOption[]>>(
		'/menu/findHandicap',
		{
			method: 'GET',
			params,
		}
	);
	return data;
};

// ----- 系统字典 END

// START 管理员相关 -----

/** 获取 admin 登陆授权码 POST */
export async function getCaptcha(code: string) {
	return request<Blob>(`${ApiUrls.Captcha}`, {
		method: 'POST',
		data: {
			browserFingerprint: code,
		},
		responseType: 'blob',
	});
}

/** 登录接口 POST /scy/login */
export async function adminLogin(data: API.LoginParams) {
	return request<API.LoginResult>(ApiUrls.Login, {
		method: 'POST',
		data: {
			...data,
			platform: 'mgt',
		},
	});
}

/** 登出接口 POST /scy/logout */
export async function adminLogout() {
	return request<API.LoginResult>(ApiUrls.Logout, {
		method: 'POST',
	});
}

/** 获取当前的管理员信息 GET /backend/admin/info */
export async function queryCurrentAdmin() {
	return request<API.CommonData<API.CurrentAdmin>>('/backend/admin/info', {
		method: 'GET',
	});
}

/** 更新当前的管理员密码 PUT /sys/user/pwd */
export function updateCurrentAdminPWD(data: API.UpdateCurrentAdminPWDParams) {
	return request<API.CommonData>('/sys/user/pwd', {
		method: 'PUT',
		data,
	});
}

/** 获取在线人数 GET /sys/user/onlineNum */
export function getOnlineUserInfo() {
	return request<API.CommonData<API.OnlineUserInfo>>('/sys/user/onlineNum', {
		method: 'GET',
		showType: ErrorShowType.SILENT,
	});
}

/** 获取仪表盘数据 POST /dashBoard/info */
export function getDashboardInfo(data: API.DashboardParams) {
	return request<API.CommonData<API.DashboardInfo>>('/dashBoard/info', {
		method: 'POST',
		data: {
			...data,
			queryCode: Number(data.queryCode),
		},
	});
}

/** 获取权限规则列表 GET /sys/menu/all/list */
export const queryMenuList = async () => {
	const { data } = await request<API.MenuListResult>('/sys/menu/all/list', {
		method: 'GET',
	});
	return {
		list: data,
		success: true,
	};
};

/** 获取权限规则树 GET /sys/menu/all/tree */
export const queryMenuTree = async () => {
	const { data } = await request<API.MenuListResult>('/sys/menu/all/tree', {
		method: 'GET',
	});
	return data;
};

/** 创建权限规则 POST /sys/menu/add */
export const createMenu = (data: API.MenuEditItem) => {
	return request<API.CommonData>('/sys/menu/add', {
		method: 'POST',
		data,
	});
};

/** 删除权限规则 GET /sys/menu/del */
export const deleteMenu = (id: string) => {
	return request<API.CommonData>('/sys/menu/del', {
		method: 'GET',
		params: { id },
	});
};

/** 编辑权限规则 POST /sys/menu/update */
export const updateMenu = (data: Partial<API.MenuItem>) => {
	return request<API.CommonData>('/sys/menu/update', {
		method: 'POST',
		data: data,
	});
};

/** 获取角色列表 POST /sys/role/page */
export const queryRoleList: ProTableRequest<API.RoleItem> = async (params) => {
	const { data } = await request<API.RoleListResult>('/sys/role/page', {
		method: 'POST',
		data: parseListParams(params),
	});
	return parseListResponse(data);
};

/** 获取角色未关联/已关联用户列表 POST /sys/role/query_user */
export const queryRoleUserLists = async (roleId: number) => {
	const { data } = await request<
		API.CommonData<{
			bindUser: API.RoleUserItem[];
			unBindUser: API.RoleUserItem[];
		}>
	>('/sys/role/query_user', {
		method: 'POST',
		data: { roleId },
	});
	return {
		bindUser: data.bindUser.map((user) => ({ ...user, key: `${user.id}` })),
		unBindUser: data.unBindUser.map((user) => ({ ...user, key: `${user.id}` })),
	};
};

/** 创建角色 POST /sys/role/new */
export const createRole = (data: API.RoleEditItem) => {
	return request<API.CommonData>('/sys/role/new', {
		method: 'POST',
		data,
	});
};

/** 删除角色 DELETE /sys/role/delete */
export const deleteRole = (id: number) => {
	return request<API.CommonData>('/sys/role/delete', {
		method: 'DELETE',
		data: { id },
	});
};

/** 编辑角色 PUT /sys/role/update */
export const updateRole = (data: API.RoleEditItem) => {
	return request<API.CommonData>('/sys/role/update', {
		method: 'PUT',
		data,
	});
};

/** 关联用户 PUT /sys/role/bind_user */
export const roleBindUser = (data: API.RoleBindUserParams) => {
	return request<API.CommonData>('/sys/role/bind_user', {
		method: 'PUT',
		data,
	});
};

/** 关联资源 POST /sys/role/bind-menu */
export const roleBindMenu = (data: { roleId: number; menuIds: number[] }) => {
	return request<API.CommonData>('/sys/role/bind-menu', {
		method: 'POST',
		data,
	});
};

/** 关联资源-角色权限规则 GET /sys/role/query-menu */
export const queryRoleMenuTree = async (roleId: number) => {
	const { data } = await request<API.CommonData<API.RoleMenuItem[]>>(
		'/sys/role/query-menu',
		{
			method: 'GET',
			params: { roleId },
		}
	);
	return data;
};

/** 获取本账号的资源列表 POST /sys/menu/user */
export const queryMyMenuList = async () => {
	const { data } = await request<API.MenuListResult>('/sys/menu/user', {
		method: 'GET',
	});
	return data;
};

/** 获取收藏菜单 GET /sys/user/collectMenu/list */
export const queryMyCollectMenuList = async () => {
	const { data } = await request<API.CommonData<API.MyCollectMenuItem[]>>(
		'/sys/user/collectMenu/list',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 收藏/取消收藏菜单 POST /sys/user/collectMenu/update */
export const collectMyMenu = async (data: API.ColectMenuParams) => {
	return request<API.CommonData>('/sys/user/collectMenu/update', {
		method: 'POST',
		data,
	});
};

/** 获取管理员成员列表 POST /sys/user/page */
export const queryAdminList: ProTableRequest<API.AdminItem> = async (
	params
) => {
	const { data } = await request<API.AdminListResult>('/sys/user/page', {
		method: 'POST',
		data: parseListParams(params),
	});
	return parseListResponse(data);
};

/** 创建管理员成员 POST /sys/user/new */
export const createAdmin = (data: API.AdminCreateItem) => {
	return request<API.CommonData>('/sys/user/new', {
		method: 'POST',
		data,
	});
};

/** 删除管理员成员 DELETE /sys/user/delete */
export const deleteAdmins = (userIds: number[]) => {
	return request<API.CommonData>('/sys/user/delete', {
		method: 'DELETE',
		data: userIds,
	});
};

/** 禁用解禁管理员成员 PUT /sys/user/enable */
export const enableAdmins = (data: API.AdminEnableParams) => {
	return request<API.CommonData>('/sys/user/enable', {
		method: 'PUT',
		data: data,
	});
};

/** 编辑管理员成员 PUT /sys/user/update_info */
export const updateAdmin = (data: Partial<API.AdminEditItem>) => {
	return request<API.CommonData>('/sys/user/update_info', {
		method: 'PUT',
		data,
	});
};

/** 设置管理员成员密码 POST /sys/user/update_pwd */
export const updateAdminPWD = (data: API.AdminEditPWDParams) => {
	return request<API.CommonData>('/sys/user/update_pwd', {
		method: 'POST',
		data,
	});
};

/** 管理员成员授权码 PUT /sys/user/google */
export const authorizeAdmin = (data: API.AdminAuthParams) => {
	return request<API.CommonData<API.AdminAuthData>>('/sys/user/google', {
		method: 'PUT',
		data,
	});
};

/** 管理员的角色下拉列表 GET /sys/user/roleMenu */
export const getRoleMenuForAdmin = async () => {
	const { data } = await request<API.CommonData<API.RoleMenu[]>>(
		'/sys/user/roleMenu',
		{
			method: 'GET',
		}
	);

	return data;
};

/** 管理员绑定角色 PUT /sys/user/bind_role */
export const bindAdminRole = (data: API.AdminBindRoleParams) => {
	return request<API.CommonData>('/sys/user/bind_role', {
		method: 'PUT',
		data,
	});
};

// ----- 管理员相关 END

// START 会员中心 -----
/** 获取会员列表 POST /member/page */
export const queryMemberList: ProTableRequest<API.MemberItem> = async (
	params
) => {
	const { data } = await request<API.MemberListResult>('/member/page', {
		method: 'POST',
		data: parseListParams(params),
	});
	return parseSummaryListResponse(data);
};

/** 编辑会员状态 POST /member/enable */
export const updateMemberStatus = (
	data: Pick<API.MemberItem, 'id' | 'isValidity'>
) => {
	return request<API.CommonData>('/member/enable', {
		method: 'POST',
		data,
	});
};

/** 强制会员下线 PUT /member/offline */
export const forceMemberOffline = (id: number) => {
	return request<API.CommonData>('/member/offline', {
		method: 'PUT',
		data: { id },
	});
};

/** 获取余额日志列表 POST /accountTrade/findPage */
export const queryBalanceLogList: ProTableRequest<API.BalanceLogItem> = async (
	params
) => {
	const { data } = await request<API.BalanceLogListResult>(
		'/accountTrade/findPage',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseListResponse(data);
};
// ----- 会员中心 END

// START 报表统计 -----
/** 获取會員投注報表 POST /report/bettors/page */
export const queryBettorList: ProTableRequest<API.BettorItem> = async (
	params
) => {
	const { data } = await request<API.BettorListResult>('/report/bettors/page', {
		method: 'POST',
		data: parseListParams(params),
	});
	return parseSummaryListResponse(data);
};

/** 获取營收報表 POST /report/revenue/page */
export const queryRevenueList: ProTableRequest<API.RevenueItem> = async (
	params
) => {
	const { data } = await request<API.RevenueListResult>(
		'/report/revenue/page',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseSummaryListResponse(data);
};

/** 获取游戏汇总 POST /report/game/page */
export const queryGameSummaryList: ProTableRequest<
	API.GameSummaryItem
> = async (params) => {
	const { data } = await request<API.GameSummaryListResult>(
		'/report/game/page',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseSummaryListResponse(data);
};
// ----- 报表统计 END

// START 会员中心相关 -----
/** 获取地址列表 POST /member/address/page */
export const queryAddressList: ProTableRequest<API.AddressItem> = async (
	params
) => {
	const { data } = await request<API.AddressListResult>(
		'/member/address/page',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseListResponse(data);
};
// ----- 会员中心相关 END

// START 游戏管理 -----
/** 获取游戏类型列表 GET /gameData/findGameTypePage */
export const queryGameTypeList: ProTableRequest<API.GameTypeItem> = async (
	params
) => {
	const { data } = await request<API.CommonListData<API.GameTypeItem>>(
		'/gameData/findGameTypePage',
		{
			method: 'GET',
			params: parseListParams(params),
		}
	);
	return parseListResponse(data);
};

/** 编辑游戏类型 POST /gameData/compileGameType */
export const updateGameType = (data: API.GameTypeEditItem) => {
	return request<API.CommonData>('/gameData/compileGameType', {
		method: 'POST',
		data: createFileFormData(data),
	});
};

/** 获取游戏列表 GET /gameData/findPage */
export const queryGameList: ProTableRequest<API.GameItem> = async (params) => {
	const { data } = await request<API.GameListResult>('/gameData/findPage', {
		method: 'GET',
		params: parseListParams(params),
	});
	return parseListResponse(data);
};

/** 编辑游戏 POST /gameData/compile */
export const updateGame = (data: API.GameEditItem) => {
	return request<API.CommonData>('/gameData/compile', {
		method: 'POST',
		data: createFileFormData(data, [
			{ urlName: 'iconUrl', fileName: 'file' },
			{ urlName: 'moveIconUrl', fileName: 'moveFile' },
		]),
	});
};

/** 获取游戏玩法列表 GET /playManage/find */
export const queryGamePlayTypeList = async (params: {
	lotteryCode: string;
	isValidity: SwitchStatus;
	playTypeCode: string;
}) => {
	const { data } = await request<API.CommonData<API.GamePlayTypeItem[]>>(
		'/playManage/find',
		{
			method: 'POST',
			data: params,
		}
	);
	return {
		data,
		success: true,
	};
};

/** 切换游戏玩法状态 GET /playManage/update */
export const switchGamePlayTypeStatus = (
	params: Pick<API.GamePlayTypeItem, 'id' | 'isValidity'> & {
		lotteryCode: string;
	}
) => {
	return request<API.CommonData>('/playManage/update', {
		method: 'GET',
		params,
	});
};

/** 获取维护游戏列表 GET /maintain/find */
export const queryGameStatusList = async () => {
	const { data } = await request<API.CommonData<API.GameStatusListData>>(
		'/maintain/find',
		{
			method: 'GET',
		}
	);
	return data;
};
/** 编辑游戏状态 GET /maintain/update */
export const updateGameStatus = (data: API.GameStatusEditItem) => {
	return request<API.CommonData>('/maintain/update', {
		method: 'GET',
		params: data,
	});
};

/** 查询游戏维护计划 GET /maintain/findPlan */
export const queryGameMaintainPlanList: ProTableRequest<
	API.GameMaintainPlanItem
> = async () => {
	const { data } = await request<API.CommonData<API.GameMaintainPlanItem[]>>(
		'/maintain/findPlan',
		{
			method: 'GET',
		}
	);
	return {
		data,
		success: true,
	};
};
/** 新建游戏维护计划 POST /maintain/savePlan */
export const addGameMaintainPlan = (data: API.GameMaintainPlanEditItem) => {
	return request<API.CommonData>('/maintain/savePlan', {
		method: 'POST',
		data,
	});
};
/** 编辑游戏维护计划 POST /maintain/updatePlan */
export const updateGameMaintainPlan = (data: API.GameMaintainPlanEditItem) => {
	return request<API.CommonData>('/maintain/updatePlan', {
		method: 'POST',
		data,
	});
};

/** 删除游戏维护计划 GET /maintain/deletePlan */
export const deleteGameMaintainPlan = (id: string) => {
	return request<API.CommonData>('/maintain/deletePlan', {
		method: 'GET',
		params: { id },
	});
};

/** 获取游戏注单列表 POST /order/findPage */
export const queryGameOrderList: ProTableRequest<API.GameOrderItem> = async (
	params
) => {
	const { data } = await request<API.GameOrderListResult>('/order/findPage', {
		method: 'POST',
		data: parseListParams(params),
	});
	return parseListResponse(data);
};
/** 获取游戏注单合计 POST /order/sumOrder */
export const queryGameOrderSummary = async (params: any) => {
	const { data } = await request<API.CommonData<API.GameOrderSummary>>(
		'/order/sumOrder',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return data;
};

/** 取消游戏注单 GET /order/cancel */
export const cancelGameOrder = (data: { id: number; lotteryCode: string }) => {
	return request<API.CommonData>('/order/cancel', {
		method: 'GET',
		params: data,
	});
};

/** 取消全部彩票注单 GET /order/cancel/periodsNumber */
export const cancelAllGameOrder = (data: {
	periodsNumber: number;
	lotteryCode: string;
}) => {
	return request<API.CommonData>('/order/cancel/periodsNumber', {
		method: 'GET',
		params: data,
	});
};

/** 查询当前取消注单功能状态 GET /order/findCancelSwitch */
export const queryGameOrderCancelStatus = (data: { lotteryCode: string }) => {
	return request<API.CommonData<API.SwitchGameOrderCancelParams>>(
		'/order/findCancelSwitch',
		{
			method: 'GET',
			params: data,
		}
	);
};

/** 取消游戏功能切换 GET /order/updateCancelSwitch */
export const switchGameOrderCancel = (
	data: API.SwitchGameOrderCancelParams
) => {
	return request<API.CommonData>('/order/updateCancelSwitch', {
		method: 'GET',
		params: data,
	});
};

/** 获取游戏开奖列表 POST /draw/findDrawPage */
export const queryGameDrawList: ProTableRequest<API.GameDrawItem> = async (
	params
) => {
	const { data } = await request<API.GameDrawListResult>('/draw/findDrawPage', {
		method: 'POST',
		data: parseListParams(params),
	});
	return parseListResponse(data);
};

/** 手动开奖 POST /draw/manualDraw */
export const manualDraw = (data: API.ManualDrawParams) => {
	return request<API.CommonData>('/draw/manualDraw', {
		method: 'POST',
		data,
	});
};

/** 跳过当期开奖 POST /draw/updatePeriod */
export const skipCurrentDraw = (data: API.SkipCurrentDrawParams) => {
	return request<API.CommonData>('/draw/updatePeriod', {
		method: 'POST',
		data,
	});
};

/** 获取游戏赔率列表 GET /odds/findOddsPage */
export const queryGameOddList = async (
	params: {
		current?: number;
	} & API.LotteryNMerchatNHandicapParams
) => {
	const { data } = await request<API.GameOddListResult>('/odds/findOddsPage', {
		method: 'GET',
		params: parseListParams({
			pageSize: 10,
			...params,
		}),
	});
	return parseListResponse(data);
};

/** 编辑游戏赔率 -- 单独 POST /odds/updateOdds */
export const updateGameOdd = (data: API.GameOddEditItem & { id: number }) => {
	return request<API.CommonData>('/odds/updateOdds', {
		method: 'POST',
		data,
	});
};

/** 编辑游戏赔率 -- 玩法 POST /odds/updateOddsBatch */
export const updateGameGroupOdd = (data: API.GameGroupOddBatchEditItem) => {
	return request<API.CommonData>('/odds/updateOddsBatch', {
		method: 'POST',
		data,
	});
};

/** 初始化游戏赔率 GET /odds/initialize */
export const initGameOdds = (
	data: {
		playTypeCode: string;
	} & API.LotteryNMerchatNHandicapParams
) => {
	return request<API.CommonData>('/odds/initialize', {
		method: 'GET',
		params: data,
	});
};

/** 刷新游戏赔率缓存 GET /odds/refresh */
export const refreshGameOddsCache = (
	data: API.LotteryNMerchatNHandicapParams
) => {
	return request<API.CommonData>('/odds/refresh', {
		method: 'GET',
		params: data,
	});
};

/** 获取游戏限额设定列表 POST /quota/findPage */
export const queryGameQuotaList: ProTableRequest<API.GameQuotaItem> = async (
	params
) => {
	const { data } = await request<API.GameQuotaListResult>('/quota/findPage', {
		method: 'POST',
		data: parseListParams(params),
	});
	return parseListResponse(data);
};

/** 编辑游戏限额设定 POST /quota/update */
export const updateGameQuota = (
	data: API.GameQuotaEditItem & API.LotteryNMerchatNHandicapParams
) => {
	return request<API.CommonData>('/quota/update', {
		method: 'POST',
		data,
	});
};

/** 初始化游戏限额设定 GET /quota/initialize */
export const initGameQuota = (
	data: {
		limitGroupCode: string;
	} & API.LotteryNMerchatNHandicapParams
) => {
	return request<API.CommonData>('/quota/initialize', {
		method: 'GET',
		params: data,
	});
};

/** 刷新游戏限额设定缓存 GET /quota/refresh */
export const refreshGameQuota = (
	params: API.LotteryNMerchatNHandicapParams
) => {
	return request<API.CommonData>('/quota/refresh', {
		method: 'GET',
		params: params,
	});
};

/** 获取开盘时间列表 POST /drawingDate/find */
export const queryOpenTimeList: ProTableRequest<API.OpenTimeItem> = async (
	params
) => {
	const { data } = await request<API.CommonListData<API.OpenTimeItem>>(
		'/drawingDate/find',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseListResponse(data);
};

/** 编辑开盘时间 POST /drawingDate/update */
export const updateOpenTime = (data: API.OpenTimeEditItem) => {
	return request<API.CommonData>('/drawingDate/update', {
		method: 'POST',
		data,
	});
};

/** 切换开盘时间模式 GET /drawingDate/updatePattern */
export const switchOpenTime = (params: API.OpenTimeSwitchItem) => {
	return request<API.CommonData>('/drawingDate/updatePattern', {
		method: 'GET',
		params,
	});
};

// ----- 游戏管理 END

// START 日志管理 -----
/** 获取登录日志列表 POST /log/login/list */
export const queryLoginLogList: ProTableRequest<API.LoginLogItem> = async (
	params
) => {
	const { data } = await request<API.LoginLogListResult>('/log/login/list', {
		method: 'POST',
		data: parseListParams(params),
	});
	return parseListResponse(data);
};

/** 获取系统日志列表 POST /log/sys/list */
export const querySystemLogList: ProTableRequest<API.SystemLogItem> = async (
	params
) => {
	const { data } = await request<API.CommonListData<API.SystemLogItem>>(
		'/log/sys/list',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseListResponse(data);
};

/** 获取操作日志列表 POST /log/operate/list */
export const queryOperateLogList: ProTableRequest<API.OperateLogItem> = async (
	params
) => {
	const { data } = await request<API.CommonListData<API.OperateLogItem>>(
		'/log/operate/list',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseListResponse(data);
};

// ----- 日志管理 END

// START 聊天室管理 -----

/** 获取模板配置列表 GET /chat/template/list */
export const queryChatTemplateList = async (params: { gameCode: string }) => {
	const { data } = await request<API.ChatTemplateListResult>(
		'/chat/template/list',
		{
			method: 'GET',
			params,
		}
	);
	return {
		success: true,
		data,
	};
};

/** 编辑模板 POST /chat/template/update */
export const updateChatTemplate = (data: API.ChatTemplateEdit) => {
	return request<API.CommonData>('/chat/template/update', {
		method: 'POST',
		data,
	});
};

/** 获取模板预览 POST /chat/template/preview */
export const previewChatTemplate = async (params: API.ChatTemplateEdit) => {
	const { data } = await request<API.CommonData<string>>(
		'/chat/template/preview',
		{
			method: 'POST',
			data: params,
		}
	);
	return data;
};

/** 获取指令列表 GET /chat/command/list */
export const queryCommandList = async (params: { gameCode: string }) => {
	const { data } = await request<API.CommandListResult>('/chat/command/list', {
		method: 'GET',
		params,
	});
	return data;
};

/** 编辑指令 POST /chat/command/update */
export const updateCommand = (commands: API.CommandEdit[]) => {
	return request<API.CommonData>('/chat/command/update', {
		method: 'POST',
		data: { commands },
	});
};

/** 获取指令预览 POST /chat/command/preview */
export const previewCommand = (commands: API.CommandEdit) => {
	return request<API.CommonData<string>>('/chat/command/preview', {
		method: 'POST',
		data: commands,
	});
};

/** 获取发言配置 GET /chat/speak/config/list */
export const queryPostSettings = async () => {
	const { data } = await request<API.CommonData<API.PostSetting[]>>(
		'/chat/speak/config/list',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 编辑发言配置 POST /chat/speak/config/update */
export const updatePostSetting = (data: API.PostSettingEdit) => {
	return request<API.CommonData>('/chat/speak/config/update', {
		method: 'POST',
		data,
	});
};

/** 获取游戏禁言配置 GET /chat/speak/game-ban/list */
export const queryGameBanList = async () => {
	const { data } = await request<API.CommonData<API.GameBanItem[]>>(
		'/chat/speak/game-ban/list',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 编辑游戏禁言配置 POST /chat/speak/game-ban/update */
export const updateGameBan = (data: API.GameBanEditItem) => {
	return request<API.CommonData>('/chat/speak/game-ban/update', {
		method: 'POST',
		data,
	});
};

/** 获取禁言配置 POST /chat/speak/ban/page */
export const queryBanSettingList: ProTableRequest<API.MemberBanItem> = async (
	params
) => {
	const { data } = await request<API.CommonListData<API.MemberBanItem>>(
		'/chat/speak/ban/page',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseListResponse(data);
};

/** 新增禁言配置 POST /chat/speak/ban/add */
export const addBanSetting = (data: API.MemberBanEditItem) => {
	return request<API.CommonData>('/chat/speak/ban/add', {
		method: 'POST',
		data,
	});
};

/** 删除禁言配置 GET /chat/speak/ban/delete */
export const deleteBanSetting = (id: string) => {
	return request<API.CommonData>('/chat/speak/ban/delete', {
		method: 'GET',
		params: { id },
	});
};

// ----- 聊天室管理 END

// START 风控管理 -----
/** 获取风控预警记录 POST /warn/warningRecordPage */
export const queryRiskList: ProTableRequest<API.RiskItem> = async (params) => {
	const { data } = await request<API.CommonListData<API.RiskItem>>(
		'/warn/warningRecordPage',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseListResponse(data);
};

/** 获取风控预警配置 GET /warn/detail */
export const queryRiskSettings = async () => {
	const { data } = await request<API.CommonData<API.RiskSettings>>(
		'/warn/detail',
		{
			method: 'GET',
		}
	);
	return data;
};

/** 编辑风控配置 POST /warn/saveOrUpdate */
export const updateRiskSettings = (data: API.RiskSettingsEdit) => {
	return request<API.CommonData>('/warn/saveOrUpdate', {
		method: 'POST',
		data,
	});
};

// ----- 风控管理 END

// START 定时任务管理 -----
/** 获取定时任务列表 POST /dictionary/findJobParam */
export const queryJobList: ProTableRequest<API.JobItem> = async (params) => {
	const { data } = await request<API.CommonListData<API.JobItem>>(
		'/dictionary/findJobParam',
		{
			method: 'POST',
			data: parseListParams(params),
		}
	);
	return parseListResponse(data);
};

/** 编辑定时任务 POST /dictionary/updateJobParam */
export const updateJob = (data: API.JobEditItem) => {
	return request<API.CommonData>('/dictionary/updateJobParam', {
		method: 'POST',
		data,
	});
};

/** 切换定时任务 POST /dictionary/updateJobSwitch */
export const switchJob = (data: Pick<API.JobItem, 'id' | 'isValidity'>) => {
	return request<API.CommonData>('/dictionary/updateJobSwitch', {
		method: 'POST',
		data,
	});
};

/** 编辑定时任务 POST /dictionary/saveJobParam */
export const createJob = (data: API.JobEditItem) => {
	return request<API.CommonData>('/dictionary/saveJobParam', {
		method: 'POST',
		data,
	});
};

/** 删除定时任务 GET /dictionary/delete */
export const deleteJob = (id: number) => {
	return request<API.CommonData>('/dictionary/delete', {
		method: 'GET',
		params: { id },
	});
};
// ----- 定时任务管理 END

// START 网站管理 -----
/** 获取图文配置列表 GET /sys/img/list */
export const queryTextImgList: ProTableRequest<API.TextImgItem> = async () => {
	const { data } = await request<API.CommonData<API.TextImgItem[]>>(
		'/sys/img/list',
		{
			method: 'GET',
		}
	);
	return {
		success: true,
		data,
	};
};

/** 编辑图文配置 POST /sys/img/update */
export const updateTextImg = (data: API.TextImgEditItem) => {
	return request<API.CommonData>('/sys/img/update', {
		method: 'POST',
		data: createFileFormData(data, [{ urlName: 'fileUrl', fileName: 'file' }]),
	});
};

/** 获取客服列表 GET /sys/ctmservice/list */
export const queryCustomServiceList: ProTableRequest<
	API.CustomServiceItem
> = async () => {
	const { data } = await request<API.CommonData<API.CustomServiceItem[]>>(
		'/sys/ctmservice/list',
		{
			method: 'GET',
		}
	);
	return {
		success: true,
		data,
	};
};

/** 编辑客服 POST /sys/ctmservice/update */
export const updateCustomService = (data: API.CustomServiceEditItem) => {
	return request<API.CommonData>('/sys/ctmservice/update', {
		method: 'POST',
		data,
	});
};

/** 开启关闭客服 POST /sys/ctmservice/enable */
export const switchCustomService = (data: API.CustomServiceSwitchParams) => {
	return request<API.CommonData>('/sys/ctmservice/enable', {
		method: 'POST',
		data,
	});
};

/** 获取文案配置列表 GET /sys/doc/list */
export const queryCopyList: ProTableRequest<API.CopyItem> = async () => {
	const { data } = await request<API.CommonData<API.CopyItem[]>>(
		'/sys/doc/list',
		{
			method: 'GET',
		}
	);
	return {
		success: true,
		data,
	};
};

/** 编辑文案配置 POST /sys/doc/edit */
export const updateCopy = (data: API.CopyEditItem) => {
	return request<API.CommonData>('/sys/doc/edit', {
		method: 'POST',
		data,
	});
};

/** 图片上传 POST /sys/doc/img */
export const uploadImg = (data: FormData) => {
	return request<API.CommonData<string>>('/sys/doc/img', {
		method: 'POST',
		data,
	});
};

// ----- 网站管理 END

// START 测试管理 -----
/** 获取测试列表 GET /draw/test/list */
export const queryTestList: ProTableRequest<API.TestItem> = async () => {
	const { data } = await request<API.CommonData<API.TestItem[]>>(
		'/draw/test/list',
		{
			method: 'GET',
		}
	);
	return {
		success: true,
		data,
	};
};

/** 编辑测试 POST /draw/test/game */
export const updateTest = (data: API.TestEditItem) => {
	return request<API.CommonData>('/draw/test/game', {
		method: 'POST',
		data,
	});
};

/** 开关测试 POST /draw/test/update */
export const switchTest = (data: API.TestSwitchParams) => {
	return request<API.CommonData>('/draw/test/update', {
		method: 'POST',
		data,
	});
};

// ----- 测试管理 END

// START 盘口设置 -----
/** 获取盘口列表 GET /handicap/find */
export const queryHandicapList: ProTableRequest<
	API.HandicapItem
> = async () => {
	const { data } = await request<API.CommonData<API.HandicapItem[]>>(
		'/handicap/find',
		{
			method: 'POST',
		}
	);
	return {
		success: true,
		data,
	};
};

/** 保存盘口设置 POST  */
export const updateHandicap = (data: API.HandicapEditItem) => {
	return request<API.CommonData>('/handicap/save', {
		method: 'POST',
		data,
	});
};
// ----- 盘口设置 END

// START -----
// ----- END

// START -----
// ----- END

// START -----
// ----- END
