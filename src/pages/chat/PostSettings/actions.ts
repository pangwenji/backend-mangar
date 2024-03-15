import { addBanSetting, deleteBanSetting } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 新增禁言
 *
 * @param fields
 */
export const handleBanSettingAdd = async (fields: API.MemberBanEditItem) => {
	const hide = message.loading('正在新增禁言配置');

	try {
		await addBanSetting(fields);
		hide();
		message.success('新增禁言配置成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('新增禁言配置失败, 请重试！');
		return false;
	}
};

/**
 * 删除禁言
 *
 * @param fields
 */
export const handleBanSettingDelete = async (id: string) => {
	const hide = message.loading('正在删除禁言配置');
	console.log('id => ', id);
	try {
		await deleteBanSetting(id);
		hide();
		message.success('删除禁言配置成功');
		return true;
	} catch (error: any) {
		hide();
		// message.error('删除禁言配置失败, 请重试！');
		return false;
	}
};
