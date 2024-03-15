import {
	initGameQuota,
	refreshGameQuota,
	updateGameQuota,
} from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';
import { isEqual } from 'lodash';

/**
 * 更新限额设定
 *
 * @param fields
 */

export const handleGameQuotaUpdate = async (
	fields: API.GameQuotaEditItem,
	currentRow: API.GameQuotaItem,
	props: API.LotteryNMerchatNHandicapParams
) => {
	if (
		isEqual(currentRow, {
			...currentRow,
			...fields,
		})
	) {
		message.info('无变更内容');
		return true;
	}

	const hide = message.loading('正在更新限额设定');

	try {
		await updateGameQuota({
			...fields,
			...props,
		});
		hide();
		message.success('更新限额设定成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('更新限额设定失败, 请重试！');
		return false;
	}
};

/**
 * 初始化限额设定
 *
 * @param fields
 */

export const handleGameQuotaInit = async (
	fields: API.GameQuotaItem,
	props: API.LotteryNMerchatNHandicapParams
) => {
	const hide = message.loading('正在初始化限额设定');
	try {
		await initGameQuota({
			limitGroupCode: fields.limitGroupCode,
			...props,
		});
		hide();
		message.success('初始化限额设定成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('初始化限额设定失败, 请重试！');
		return false;
	}
};

/**
 * 刷新限额设定缓存
 *
 * @param fields
 */

export const handleGameQuotaRefresh = async (
	data: API.LotteryNMerchatNHandicapParams
) => {
	const hide = message.loading('正在刷新缓存');
	try {
		await refreshGameQuota(data);
		hide();
		message.success('刷新缓存成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('刷新缓存失败, 请重试！');
		return false;
	}
};
