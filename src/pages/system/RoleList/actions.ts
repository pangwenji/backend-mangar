import {
  createRole,
  deleteRole,
  roleBindMenu,
  roleBindUser,
  updateRole,
} from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 添加角色
 *
 * @param fields
 */

export const handleRoleAdd = async (fields: API.RoleEditItem) => {
  const hide = message.loading('正在添加');

  try {
    await createRole({ ...fields });
    hide();
    message.success('添加角色成功');
    return true;
  } catch (error) {
    hide();
    // message.error('添加角色失败, 请重试！');
    return false;
  }
};
/**
 * 更新角色
 *
 * @param fields
 */

export const handleRoleUpdate = async (
  fields: API.RoleEditItem,
  currentRow: API.RoleItem
) => {
  const hide = message.loading('正在更新角色信息');
  try {
    await updateRole({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('更新角色成功');
    return true;
  } catch (error) {
    hide();
    // message.error('更新角色失败, 请重试！');
    return false;
  }
};
/**
 * 删除角色
 *
 * @param selectedRows
 */

export const handleRoleRemove = async (selectedRow: API.RoleItem) => {
  const hide = message.loading('正在删除角色');
  if (!selectedRow) return true;
  try {
    await deleteRole(selectedRow.id);
    hide();
    message.success('删除角色成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    // message.error('删除角色失败，请重试');
    return false;
  }
};

/**
 * 关联用户
 *
 * @param fields
 */

export const handleRoleUsers = async (data: API.RoleBindUserParams) => {
  const hide = message.loading('正在关联用户');
  try {
    await roleBindUser(data);
    hide();
    message.success('关联用户成功');
    return true;
  } catch (error) {
    hide();
    // message.error('关联用户失败, 请重试！');
    return false;
  }
};

/**
 * 关联资源
 *
 * @param fields
 */

export const handleRoleMenus = async (roleId: number, menuIds: string[]) => {
  const hide = message.loading('正在关联资源');
  try {
    await roleBindMenu({
      roleId,
      menuIds: menuIds.map(Number),
    });
    hide();
    message.success('关联资源成功');
    return true;
  } catch (error) {
    hide();
    // message.error('关联资源失败, 请重试！');
    return false;
  }
};
