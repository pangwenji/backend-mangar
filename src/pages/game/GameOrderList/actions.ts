import { cancelGameOrder } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 取消游戏注单
 *
 * @param fields
 */

export const handleGameOrderCancel = async (
  fields: API.GameOrderItem,
  lotteryCode: string
) => {
  const hide = message.loading('正在取消注单');
  try {
    await cancelGameOrder({ id: fields.id, lotteryCode });
    hide();
    message.success('取消注单成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('取消注单失败, 请重试！');
    return false;
  }
};
