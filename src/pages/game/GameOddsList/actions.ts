import { updateGameGroupOdd, updateGameOdd } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 更新游戏赔率 -- 独立
 *
 * @param fields
 */

export const handleGameOddUpdate = async (
  fields: API.GameOddEditItem,
  currentRow: API.GameOddItem
) => {
  if (Number(currentRow.maxOdds) === Number(fields.odds)) {
    message.info('无变更内容');
    return true;
  }
  const hide = message.loading('正在更新赔率');

  try {
    await updateGameOdd({ ...fields, id: currentRow.id });
    hide();
    message.success('更新赔率成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('更新赔率失败, 请重试！');
    return false;
  }
};

export const handleGameGroupOddUpdate = async (
  fields: API.GameGroupOddBatchEditItem
) => {
  const hide = message.loading('正在批量更新赔率');
  try {
    await updateGameGroupOdd(fields);
    hide();
    message.success('批量更新赔率成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('批量更新赔率失败, 请重试！');
    return false;
  }
};
