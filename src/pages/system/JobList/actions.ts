import { createJob, deleteJob, switchJob, updateJob } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 添加任务
 *
 * @param fields
 */

export const handleJobAdd = async (fields: API.JobEditItem) => {
	const hide = message.loading('正在添加');
	try {
		await createJob({
			...fields,
		});
		hide();
		message.success('添加任务成功');
		return true;
	} catch (error) {
		hide();
		// message.error('添加任务失败, 请重试！');
		return false;
	}
};
/**
 * 更新任务
 *
 * @param fields
 */

export const handleJobUpdate = async (
	fields: API.JobEditItem,
	currentRow: API.JobItem
) => {
	const hide = message.loading('正在更新任务信息');
	try {
		await updateJob({
			...currentRow,
			...fields,
			param: fields.param,
		});
		hide();
		message.success('更新任务成功');
		return true;
	} catch (error) {
		hide();
		// message.error('更新任务失败, 请重试！');
		return false;
	}
};
/**
 * 删除任务
 *
 * @param selectedRows
 */

export const handleJobRemove = async (selectedRow: API.JobItem) => {
	const hide = message.loading('正在删除任务');
	if (!selectedRow) return true;
	try {
		await deleteJob(selectedRow.id);
		hide();
		message.success('删除任务成功，即将刷新');
		return true;
	} catch (error) {
		hide();
		// message.error('删除任务失败，请重试');
		return false;
	}
};

/**
 * 切换任务开关
 *
 * @param fields
 */

export const handleJobSwitch = async (
	data: Pick<API.JobItem, 'id' | 'isValidity'>
) => {
	const hide = message.loading('正在更新任务信息');
	try {
		await switchJob(data);
		hide();
		message.success('更新任务成功');
		return true;
	} catch (error) {
		hide();
		return false;
	}
};
