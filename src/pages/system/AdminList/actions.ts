import {
  authorizeAdmin,
  bindAdminRole,
  createAdmin,
  deleteAdmins,
  enableAdmins,
  updateAdmin,
  updateAdminPWD,
} from '@/services/api';
import { SwitchStatus } from '@/services/enums';
import type { API } from '@/services/typings';
import { message } from 'antd';
import { isEqual } from 'lodash';

/**
 * 添加用户
 *
 * @param fields
 */

export const handleAdminAdd = async (fields: API.AdminCreateItem) => {
  const hide = message.loading('正在添加');
  try {
    await createAdmin({ ...fields });
    hide();
    message.success('添加用户成功');
    return true;
  } catch (error) {
    hide();
    // message.error('添加用户失败, 请重试！');
    return false;
  }
};
/**
 * 更新用户
 *
 * @param fields
 */

export const handleAdminUpdate = async (
  fields: Partial<API.AdminItem>,
  currentRow: API.AdminItem,
  forceUpdate = false
) => {
  if (
    !forceUpdate &&
    isEqual(currentRow, {
      ...currentRow,
      ...fields,
    })
  ) {
    message.info('无变更内容');
    return true;
  }

  const hide = message.loading('正在更新用户信息');

  try {
    await updateAdmin({
      id: currentRow.id,
      ...fields,
    });
    hide();
    message.success('更新用户成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('更新用户失败, 请重试！');
    return false;
  }
};

/**
 * 更新用户密码
 *
 * @param fields
 */

export const handleAdminPWDUpdate = async (fields: API.AdminEditPWDParams) => {
  const hide = message.loading('正在更新用户密码');

  try {
    await updateAdminPWD({
      ...fields,
    });
    hide();
    message.success('更新用户密码成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('更新用户密码失败, 请重试！');
    return false;
  }
};
/**
 * 删除用户
 *
 * @param selectedRows
 */

export const handleAdminsRemove = async (selectedRows: API.AdminItem[]) => {
  const hide = message.loading('正在删除用户');
  if (!selectedRows) return true;
  try {
    await deleteAdmins(selectedRows.map((item) => item.id));
    hide();
    message.success('删除用户成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    // message.error('删除用户失败，请重试');
    return false;
  }
};

/**
 * 解禁/禁用用户
 *
 * @param selectedRows
 */

export const handleAdminsEnable = async (
  selectedRows: API.AdminItem[],
  status: SwitchStatus
) => {
  const hide = message.loading('正在处理用户状态');
  if (!selectedRows) return true;
  try {
    await enableAdmins({
      userIds: selectedRows.map((item) => item.id),
      isValidity: status,
    });
    hide();
    message.success('处理用户状态成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    // message.error('处理用户状态失败，请重试');
    return false;
  }
};

/**
 * 用户授权码
 *
 * @param fields
 */

export const handleAdminauthorize = async (fields: API.AdminAuthParams) => {
  const hide = message.loading('正在获取授权码信息...');
  try {
    const data = await authorizeAdmin(fields);
    hide();
    message.success('获取授权码信息成功');
    return data;
  } catch (error: any) {
    hide();
    // message.error('获取授权码信息失败, 请重试！');
    return false;
  }
};

/**
 * 关联角色
 *
 * @param fields
 */

export const handleAdminBindRole = async (
  fields: API.AdminBindRoleParams,
  currentRow: API.AdminItem
) => {
  if (isEqual(Number(currentRow.roleId), Number(fields.roleId))) {
    message.info('无变更内容');
    return true;
  }
  const hide = message.loading('正在关联用户角色');
  try {
    await bindAdminRole({
      ...fields,
      id: currentRow.id,
    });
    hide();
    message.success('关联用户角色成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('关联用户角色失败, 请重试！');
    return false;
  }
};
