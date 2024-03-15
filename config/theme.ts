export const CustomCommonBG = '#f4f8ff';
const CustomPrimary = '#2fafec';
export const DarkTextColor = '#424251';
export const BaseTextColor = '#5a577d';
export default {
  token: {
    colorInfo: CustomPrimary,
    colorLink: CustomPrimary,
    colorPrimary: CustomPrimary,
    colorTextHeading: DarkTextColor,
    colorText: BaseTextColor,
    borderRadiusSM: 6,
    colorSuccess: '#2bb596',
    colorError: '#ee5b75',
    colorWarning: '#eea62e',
  },
  components: {
    Button: {
      colorTextDisabled: 'rgba(72, 71, 96, 0.5)',
      colorBgContainerDisabled: 'rgba(72, 71, 96, 0.28)',
    },
    Form: {
      labelColor: BaseTextColor,
      colorTextHeading: BaseTextColor,
      colorText: DarkTextColor,
    },
    Table: {
      headerBg: '#f8fbff',
      bodySortBg: '#f8fbff',
    },
    Tabs: {
      inkBarColor: CustomPrimary,
      itemActiveColor: DarkTextColor,
      itemSelectedColor: DarkTextColor,
      itemHoverColor: DarkTextColor,
      itemColor: 'rgba(72, 71, 96, 0.5)',
      titleFontSizeLG: 14,
    },
    Breadcrumb: {
      itemColor: BaseTextColor,
      lastItemColor: DarkTextColor,
    },
    Card: {
      headerBg: CustomCommonBG,
      colorTextHeading: DarkTextColor,
      borderRadiusLG: 6,
    },
    Modal: {
      borderRadiusLG: 10,
      titleFontSize: 14,
      colorText: DarkTextColor,
    },
    Tooltip: {
      borderRadiusOuter: 6,
      borderRadiusLG: 6,
      colorText: '#fff',
    },
    Popover: {
      borderRadiusOuter: 6,
      borderRadiusLG: 6,
    },
    Pagination: {
      itemActiveBg: BaseTextColor,
      colorPrimaryBorder: BaseTextColor,
      colorPrimary: '#fff',
      borderRadius: 4,
    },
    Switch: {
      trackHeight: 34,
      handleSize: 26,
      trackMinWidth: 70,
      handleShadow: 'none',
      fontSizeIcon: 14,
    },
  },
};
