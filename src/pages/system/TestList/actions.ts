import { switchTest, updateTest } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 设置开奖结果
 *
 * @param fields
 */

export const handleTestUpdate = async (
  fields: API.TestEditItem,
  currentRow: API.TestItem
) => {
  const hide = message.loading('正在设置开奖结果');
  try {
    await updateTest({
      ...fields,
      lotteryCode: currentRow.lotteryCode,
      periodsNumber: currentRow.periodsNumber,
    });
    hide();
    message.success('设置开奖结果成功');
    return true;
  } catch (error) {
    hide();
    // message.error('设置开奖结果失败, 请重试！');
    return false;
  }
};

/**
 * 开关测试
 *
 * @param fields
 */

export const handleTestSwitch = async (fields: API.TestSwitchParams) => {
  const hide = message.loading('正在更新测试状态');
  try {
    await switchTest(fields);
    hide();
    message.success('更新测试状态成功');
    return true;
  } catch (error) {
    hide();
    // message.error('更新测试状态失败, 请重试！');
    return false;
  }
};
