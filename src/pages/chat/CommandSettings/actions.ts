import { previewCommand, updateCommand } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 更新指令
 *
 * @param fields
 */

export const handleCommandUpdate = async (fields: API.CommandEdit[]) => {
  const hide = message.loading('正在更新指令');

  try {
    await updateCommand(fields);
    hide();
    message.success('更新指令成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('更新指令失败, 请重试！');
    return false;
  }
};

/**
 * 预览指令
 *
 * @param fields
 */

export const handleCommandPreview = async (fields: API.CommandEdit) => {
  const hide = message.loading('正在更新预览');
  try {
    const data = await previewCommand(fields);
    hide();
    message.success('更新预览成功');
    return data.data;
  } catch (error: any) {
    hide();
    // message.error('更新预览失败, 请重试！');
    return false;
  }
};
