import {
	switchGamePlayTypeStatus,
	switchOpenTime,
	updateGame,
	updateGameType,
	updateOpenTime,
} from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';
import { isEqual } from 'lodash';

/**
 * 创建游戏
 *
 * @param fields
 */

export const handleGameAdd = async (fields: API.GameEditItem) => {
	const hide = message.loading('正在创建游戏');
	try {
		await updateGame(fields);
		hide();
		message.success('创建游戏成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('创建游戏失败, 请重试！');
		return false;
	}
};

/**
 * 更新游戏
 *
 * @param fields
 */

export const handleGameUpdate = async (
	fields: API.GameEditItem,
	currentRow: API.GameItem
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

	const hide = message.loading('正在更新游戏');

	try {
		await updateGame({
			...fields,
			id: currentRow.id,
		});
		hide();
		message.success('更新游戏成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('更新游戏失败, 请重试！');
		return false;
	}
};

/**
 * 创建游戏类型
 *
 * @param fields
 */
export const handleGameTypeAdd = async (fields: API.GameTypeEditItem) => {
	const hide = message.loading('正在创建游戏类型');
	try {
		await updateGameType(fields);
		hide();
		message.success('创建游戏类型成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('创建游戏类型失败, 请重试！');
		return false;
	}
};

/**
 * 更新游戏类型
 *
 * @param fields
 */
export const handleGameTypeUpdate = async (
	fields: API.GameTypeEditItem,
	currentRow: API.GameTypeItem
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

	const hide = message.loading('正在更新游戏类型');

	try {
		await updateGameType({
			...fields,
			id: currentRow.id,
		});
		hide();
		message.success('更新游戏类型成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('更新游戏类型失败, 请重试！');
		return false;
	}
};

/**
 * 停用启用游戏玩法
 *
 * @param fields
 */
export const handleGamePlayTypeSwitch = async (
	currentRow: API.GamePlayTypeItem,
	lotteryCode: string
) => {
	const hide = message.loading('正在更新玩法状态');
	try {
		await switchGamePlayTypeStatus({
			id: currentRow.id,
			isValidity: Number(!currentRow.isValidity),
			lotteryCode,
		});
		hide();
		message.success('更新玩法状态成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('更新玩法状态失败, 请重试！');
		return false;
	}
};

/**
 * 保存开盘时间配置
 *
 * @param fields
 */

export const handleOpenTimeUpdate = async (fields: API.OpenTimeEditItem) => {
	const hide = message.loading('正在保存开盘时间配置');
	try {
		await updateOpenTime(fields);
		hide();
		message.success('保存开盘时间配置成功');
		return true;
	} catch (error) {
		hide();
		return false;
	}
};

/**
 * 切换开盘时间模式
 *
 * @param fields
 */

export const handleOpenTimeSwitch = async (fields: API.OpenTimeSwitchItem) => {
	const hide = message.loading('正在切换开盘时间模式');
	try {
		await switchOpenTime(fields);
		hide();
		message.success('切换开盘时间模式成功');
		return true;
	} catch (error) {
		hide();
		return false;
	}
};
