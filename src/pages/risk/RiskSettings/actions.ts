import { updateGameStatus } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 更新游戏状态
 *
 * @param fields
 */

export const handleGameStatusUpdate = async (
  fields: API.GameStatusEditItem
) => {
  const hide = message.loading('正在更新游戏状态');

  try {
    await updateGameStatus(fields);
    hide();
    message.success('更新游戏状态成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('更新游戏状态失败, 请重试！');
    return false;
  }
};
