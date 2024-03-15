import { API } from '@/services/typings';
import { getAuthToken } from '@/utils/authToken';
import { SUPER_ADMIN_ID } from '@/utils/consts';

// 处理额外的权限 -- 用户
export const getExtraAuthInfo = (record: API.AdminItem) => {
  /* 
      1. 其他角色不能改动超管
      2. 同级之间不能改动 
      3. 自己可以改动自己, 但不能删除和禁用
    */
  const currentAdmin = getAuthToken();
  // 是否是登录用户
  const isCurrentAdmin = currentAdmin?.userId === record.id;
  // 登录用户是否超管
  const isCurrentSuper = currentAdmin?.roleId === SUPER_ADMIN_ID;
  // 同级
  const isSameLevelRecord = currentAdmin?.roleId === record.roleId;
  const isRecordSuper = record.roleId === SUPER_ADMIN_ID;

  // 非同级和用户自己
  const meOrNotSameLevelRecord = !isSameLevelRecord || isCurrentAdmin;
  return {
    isCurrentAdmin,
    isCurrentSuper,
    isSameLevelRecord,
    isRecordSuper,
    meOrNotSameLevelRecord,
  };
};

// 处理额外的权限 -- 用户
export const getExtraAuthInfoInRoleList = (record: API.RoleItem) => {
  const currentAdmin = getAuthToken();
  const isCurrentSuper = currentAdmin?.roleId === SUPER_ADMIN_ID;
  const isRecordSuper = record.id === SUPER_ADMIN_ID;
  const isSameLevel = record.id === currentAdmin?.roleId;
  return {
    isCurrentSuper,
    isRecordSuper,
    isSameLevel,
  };
};
