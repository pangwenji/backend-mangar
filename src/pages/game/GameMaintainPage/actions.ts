import {
  addGameMaintainPlan,
  deleteGameMaintainPlan,
  updateGameMaintainPlan,
  updateGameStatus,
} from '@/services/api';
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

/**
 * 更新游戏维护计划
 *
 * @param fields
 */

export const handleGameMaintainPlanUpdate = async (
  fields: API.GameMaintainPlanEditItem
) => {
  const hide = message.loading('正在更新维护计划');
  try {
    await updateGameMaintainPlan(fields);
    hide();
    message.success('更新维护计划成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('更新维护计划失败, 请重试！');
    return false;
  }
};

/**
 * 创建游戏维护计划
 *
 * @param fields
 */

export const handleGameMaintainPlanAdd = async (
  fields: API.GameMaintainPlanEditItem
) => {
  const hide = message.loading('正在新建维护计划');

  try {
    await addGameMaintainPlan(fields);
    hide();
    message.success('新建维护计划成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('新建维护计划失败, 请重试！');
    return false;
  }
};

/**
 * 删除游戏维护计划
 *
 * @param fields
 */

export const handleGameMaintainPlanDelete = async (
  fields: API.GameMaintainPlanItem
) => {
  const hide = message.loading('正在删除维护计划');
  try {
    await deleteGameMaintainPlan(fields.id);
    hide();
    message.success('删除维护计划成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('删除维护计划失败, 请重试！');
    return false;
  }
};
