import type { API, AppInitState } from '@/services/typings';

/* 
.reduce((res, item) => {
  const key = item.path
    .split('/')
    .filter(Boolean)
    .map((s) => `${s[0].toUpperCase()}${s.slice(1)}`)
    .join('');
  res[key] = item.path;

  return res;
},{}) 
*/

export const GameManagementPrefix = 'GAME_MANAGEMENT_';

/**
 * 递归 access 配置
 */
const getMenuListAccess = (list: API.MyMenuItem[]): Record<string, boolean> => {
	if (!list?.length) return {};
	return list.reduce((res, menu) => {
		return {
			...res,
			[menu.code]: true,
			...(menu.child?.length && getMenuListAccess(menu.child)),
		};
	}, {} as Record<string, boolean>);
};

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: AppInitState | undefined) {
	const { myMenuTree = [] } = initialState || {};
	const result = getMenuListAccess(myMenuTree);
	return result;
}
