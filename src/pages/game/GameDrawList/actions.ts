import { message } from 'antd';

import {
	cancelAllGameOrder,
	manualDraw,
	skipCurrentDraw,
} from '@/services/api';

import type { API } from '@/services/typings';

/**
 * 跳过当期
 *
 * @param fields
 */

export const handleSkipDrawing = async (fields: API.SkipCurrentDrawParams) => {
	const hide = message.loading('正在处理当期开奖');
	try {
		await skipCurrentDraw(fields);
		hide();
		message.success('处理当期开奖成功');
		return true;
	} catch (error: any) {
		hide();
		return false;
	}
};

/**
 * 手动开奖
 *
 * @param fields
 */

export const handleManualDrawing = async (fields: API.ManualDrawParams) => {
	const hide = message.loading('正在设置手动开奖');

	try {
		await manualDraw(fields);
		hide();
		message.success('设置手动开奖成功');
		return true;
	} catch (error: any) {
		hide();
		return false;
	}
};

/**
 * 取消全部注单（未结算）
 *
 * @param fields
 */

export const handleCancelAllOrder = async (
	fields: Omit<API.ManualDrawParams, 'drawingResult'>
) => {
	const hide = message.loading('正在取消注单');

	try {
		await cancelAllGameOrder(fields);
		hide();
		message.success('取消注单成功');
		return true;
	} catch (error: any) {
		hide();
		return false;
	}
};
