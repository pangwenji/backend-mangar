import {
	switchCustomService,
	updateCopy,
	updateCustomService,
	updateTextImg,
} from '@/services/api';

import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 更新图文配置
 *
 * @param fields
 */

export const handleTextImgUpdate = async (
	fields: API.TextImgEditItem,
	currentRow: API.TextImgItem
) => {
	const hide = message.loading('正在更新信息');
	try {
		await updateTextImg({
			...fields,
			id: currentRow.id,
		});
		hide();
		message.success('更新成功');
		return true;
	} catch (error) {
		hide();
		// message.error('更新失败, 请重试！');
		return false;
	}
};

/**
 * 更新客服
 *
 * @param fields
 */

export const handleCustomServiceUpdate = async (
	fields: API.CustomServiceEditItem,
	currentRow: API.CustomServiceItem
) => {
	const hide = message.loading('正在更新客服账号');
	try {
		await updateCustomService({
			...fields,
			id: currentRow.id,
		});
		hide();
		message.success('更新客服账号成功');
		return true;
	} catch (error) {
		hide();
		// message.error('更新客服账号失败, 请重试！');
		return false;
	}
};

/**
 * 开启关闭客服
 *
 * @param fields
 */

export const handleCustomServiceSwitch = async (
	fields: API.CustomServiceSwitchParams
) => {
	const hide = message.loading('正在更新客服状态');
	try {
		await switchCustomService(fields);
		hide();
		message.success('更新客服状态成功');
		return true;
	} catch (error) {
		hide();
		// message.error('更新客服状态失败, 请重试！');
		return false;
	}
};

/**
 * 更新文案配置
 *
 * @param fields
 */

export const handleCopyUpdate = async (
	fields: API.CopyEditItem,
	currentRow: API.CopyItem
) => {
	const hide = message.loading('正在更新信息');
	try {
		await updateCopy({
			...fields,
			id: currentRow.id,
		});
		hide();
		message.success('更新成功');
		return true;
	} catch (error) {
		hide();
		return false;
	}
};
