export { default as request } from '@/services/core';
import { AppRoutePath } from '@/../config/routes';
import {
  collectMyMenu,
  queryLotteryMenu,
  queryMyCollectMenuList,
  queryMyMenuList,
} from '@/services/api';
import type { API, AppInitState } from '@/services/typings';

import {
  ActionType,
  MenuDataItem,
  PageLoading,
} from '@ant-design/pro-components';
import { RunTimeLayoutConfig, useAccess } from '@umijs/max';
import { message } from 'antd';
import 'antd/dist/reset.css';
import { useRef } from 'react';
import defaultSettings from '../config/defaultSettings';
import {
  createNavIconSrc,
  layoutMenuRender,
  layoutSubMenuItemRender,
} from './components/layout';
import LayoutHeader from './components/layout/LayoutHeader';
import './components/layout/layoutStyles.less';
import { appLogout, getAuthToken, isLoginPage } from './utils/authToken';

const parsedSettings: any = {
  ...defaultSettings,
};

const flatMenuTree = (data?: API.MyMenuItem[]): API.MyMenuItem[] => {
  if (!data?.length) return [];
  return [...data, ...data.map((menu) => flatMenuTree(menu.child)).flat()];
};

const fetchMyMenuList = async () => {
  try {
    const data = await queryMyMenuList();
    return {
      myMenuTree: data,
      myMenuList: flatMenuTree(data),
    };
  } catch (error) {
    // appLogout();
  }
  return undefined;
};

const fetchLotteryMenu = async () => {
  try {
    const data = await queryLotteryMenu();
    return data;
  } catch (error) {
    // appLogout();
  }
  return undefined;
};

const fetchCollectedMenuList = async () => {
  try {
    const data = await queryMyCollectMenuList();
    return data;
  } catch (error) {
    // appLogout();
  }
  return undefined;
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<AppInitState> {
  // TODO 登录
  if (!isLoginPage()) {
    if (getAuthToken()) {
      const myMenuResult = await fetchMyMenuList();
      return {
        fetchMyMenuList,
        fetchLotteryMenu,
        ...myMenuResult,
        settings: parsedSettings,
      };
    } else {
      appLogout();
    }
  }

  return {
    fetchMyMenuList,
    settings: parsedSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  const access = useAccess(); // eslint-disable-line
  const actionRef = useRef<ActionType>();
  return {
    ...parsedSettings,
    ...initialState?.settings,
    actionRef,
    prefixCls: 'MyCustomLayout',
    logo: <span />, // 占位
    menu: {
      async request(_, defaultMenus) {
        const [lotteryMenu = [], myCollectMenuList = []] = (await Promise.all(
          [
            fetchLotteryMenu(),
            access.MY_COLLECTION && fetchCollectedMenuList(),
          ].filter(Boolean)
        )) as [API.LotteryItem[], false | API.MyCollectMenuItem[]];

        // 处理收藏菜单
        const collectionRouteIndex = defaultMenus.findIndex(
          (menu) => menu.path === AppRoutePath.MyCollection
        );
        const collectionRoute = defaultMenus[collectionRouteIndex];
        if (collectionRoute && myCollectMenuList && myCollectMenuList.length) {
          const findCollectedMenu = (menu: MenuDataItem): MenuDataItem[] => {
            const result: MenuDataItem[] = [];
            if (
              myCollectMenuList.find(
                (collectedMenu) => collectedMenu.code === menu.access
              )
            ) {
              result.push({
                ...menu,
                isCollected: true,
                key: `${menu.access}-collected`,
                path: `/mycollection${menu.path}`,
                redirectPath: menu.path,
              });
              menu.isCollected = true;
            }
            return [
              ...result,
              ...(menu.children?.length
                ? menu.children.map(findCollectedMenu)
                : []),
            ].flat();
          };
          collectionRoute.children = defaultMenus
            .map((menu) => {
              return findCollectedMenu(menu);
            })
            .flat();
        } else if (collectionRouteIndex > -1) {
          // 移除对应菜单
          defaultMenus.splice(collectionRouteIndex, 1);
        }

        // 保存全局状态
        setInitialState((s) => {
          return {
            ...s,
            lotteryMenu,
            ...(myCollectMenuList && {
              myCollectMenuList: myCollectMenuList,
            }),
          };
        });
        return defaultMenus;
      },
    },
    menuDataRender(localList) {
      const remoteList = initialState?.myMenuList && [
        ...initialState.myMenuList,
      ];

      const handleMenu = (menuList: MenuDataItem[] = []) => {
        if (!menuList?.length || !remoteList?.length) return menuList;
        return menuList
          .map((localMenu) => {
            //  direct route
            if (typeof localMenu.element?.props?.to === 'string') {
              return localMenu;
            }
            const targetRemoteMenuIndex = remoteList.findIndex(
              (remoteMenu) => remoteMenu.code === localMenu.access
            );

            localMenu.sort = 0;
            // 处理 menu name icon sort 和收藏功能;
            if (targetRemoteMenuIndex > -1) {
              const targetRemoteMenu = remoteList[targetRemoteMenuIndex];
              const iconName = localMenu.iconName || targetRemoteMenu.code;
              const hasIcon = createNavIconSrc(iconName, false);
              localMenu.name = targetRemoteMenu.name;
              // 默认 icon 是 INDEX.PNG
              localMenu.iconName = hasIcon ? iconName : 'INDEX';
              localMenu.sort = targetRemoteMenu.sort + targetRemoteMenuIndex;
              // 非目录菜单添加收藏功能
              if (
                localMenu.pro_layout_parentKeys.length > 0 &&
                access.MY_COLLECTION_COLLECT
              ) {
                localMenu.onCollect = async () => {
                  try {
                    await collectMyMenu({
                      menuId: Number(targetRemoteMenu.id),
                      collection: !localMenu.isCollected,
                    });
                    actionRef.current?.reload();
                  } catch {}
                };
              }

              if (localMenu.children?.length) {
                localMenu.children = handleMenu(localMenu.children);
              }
            }

            return {
              ...localMenu,
            };
          })
          .sort((aMenu, bMenu) => aMenu.sort - bMenu.sort);
      };

      return handleMenu(localList);
    },
    subMenuItemRender: layoutSubMenuItemRender,
    menuItemRender: layoutMenuRender,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!getAuthToken() && !isLoginPage()) {
        message.error('用户数据缺失，请重新登录', 2, () => {
          appLogout();
        });
      }
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      if (!initialState?.myMenuTree?.length) return <PageLoading />;
      return (
        <>
          <LayoutHeader />
          {children}
          {/* {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
  };
};
