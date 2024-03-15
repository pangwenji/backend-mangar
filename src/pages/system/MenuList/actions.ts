import { createMenu, deleteMenu, updateMenu } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 添加资源
 *
 * @param fields
 */

export const handleMenuAdd = async (fields: API.MenuEditItem) => {
  const hide = message.loading('正在添加');
  try {
    await createMenu(fields);
    hide();
    message.success('添加资源成功');
    return true;
  } catch (error) {
    hide();
    // message.error('添加资源失败, 请重试！');
    return false;
  }
};
/**
 * 更新资源
 *
 * @param fields
 */

export const handleMenuUpdate = async (fields: API.MenuEditItem) => {
  const hide = message.loading('正在更新资源');
  try {
    await updateMenu(fields);
    hide();
    message.success('更新资源成功');
    return true;
  } catch (error) {
    hide();
    // message.error('更新资源失败, 请重试！');
    return false;
  }
};
/**
 * 删除资源
 *
 * @param selectedRows
 */

export const handleMenuRemove = async (selectedRow: API.MenuItem) => {
  const hide = message.loading('正在删除资源');
  if (!selectedRow) return true;
  try {
    await deleteMenu(selectedRow.id);
    hide();
    message.success('删除资源成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    // message.error('删除资源失败，请重试');
    return false;
  }
};
