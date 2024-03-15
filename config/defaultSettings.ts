import { ProLayoutProps } from '@ant-design/pro-components/es';
import { theme } from 'antd';
import themeConfig, { CustomCommonBG } from './theme';
const { getDesignToken } = theme;
// 通过静态方法获取
const globalToken = getDesignToken(themeConfig);

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  layout: 'side',
  contentWidth: 'Fluid',
  suppressSiderWhenMenuEmpty: true, // 在菜单为空时隐藏 Sider
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: false,
  actionsRender: false,
  avatarProps: false,
  menuExtraRender: false,
  rightContentRender: false,
  headerContentRender: false,
  // headerRender: false,
  pwa: false,
  links: [],
  iconfontUrl: '',
  // 参见ts声明，demo 见文档，通过token 修改样式
  //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  siderWidth: 270,
  colorPrimary: globalToken.colorPrimary,
  token: {
    colorPrimary: globalToken.colorPrimary,
    sider: {
      colorMenuBackground: CustomCommonBG,
      colorMenuItemDivider: globalToken.colorSplit,
      colorTextMenuSelected: globalToken.colorPrimary,
      colorTextMenuActive: globalToken.colorPrimary,
      colorTextMenu: globalToken.colorText,
      colorBgMenuItemSelected: 'transparent',
      colorBgMenuItemHover: 'transparent',
      paddingInlineLayoutMenu: 0,
      menuHeight: 44,
    },
    header: {
      colorBgHeader: CustomCommonBG,
      heightLayoutHeader: 76,
    },
    pageContainer: {
      colorBgPageContainer: '#fff',
    },
  },
};

export default Settings;
