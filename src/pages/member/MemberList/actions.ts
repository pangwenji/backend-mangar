import { forceMemberOffline, updateMemberStatus } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';

/**
 * 更新会员
 *
 * @param fields
 */

export const handleMemberStatusChange = async (currentRow: API.MemberItem) => {
  const isValidity = currentRow.isValidity;
  const changeText = isValidity ? '禁用' : '启用';
  const hide = message.loading(`正在${changeText}会员`);
  try {
    await updateMemberStatus({
      id: currentRow.id,
      isValidity: Number(!isValidity),
    });
    hide();
    message.success(`${changeText}会员成功`);
    return true;
  } catch (error) {
    hide();
    // message.error(`${changeText}会员失败, 请重试！`);
    return false;
  }
};

/**
 * 强制下线
 *
 * @param fields
 */

export const handleMemberOffline = async (currentRow: API.MemberItem) => {
  const hide = message.loading(`强制玩家下线中...`);
  try {
    await forceMemberOffline(currentRow.id);
    hide();
    message.success(`强制玩家下线成功`);
    return true;
  } catch (error) {
    hide();
    // message.error(`强制玩家下线失败, 请重试！`);
    return false;
  }
};
