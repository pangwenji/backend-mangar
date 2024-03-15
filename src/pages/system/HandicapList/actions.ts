import { updateHandicap } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 保存盘口配置
 *
 * @param fields
 */

export const handleHandicapUpdate = async (fields: API.HandicapEditItem) => {
	const hide = message.loading('正在保存盘口配置');
	try {
		await updateHandicap(fields);
		hide();
		message.success('保存盘口配置成功');
		return true;
	} catch (error) {
		hide();
		// message.error('保存盘口配置失败, 请重试！');
		return false;
	}
};
