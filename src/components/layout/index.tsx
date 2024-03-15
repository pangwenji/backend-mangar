import themeConfig from '@/../config/theme';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { ProLayoutProps } from '@ant-design/pro-components/es';
import { BaseMenuProps } from '@ant-design/pro-layout/es/components/SiderMenu/BaseMenu';
import { history, Link } from '@umijs/max';
import { MenuDataItem } from '@umijs/route-utils';
import { Button } from 'antd';

const customMenuItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

const customMenuItemContentStyle: React.CSSProperties = {
  ...customMenuItemStyle,
  flex: 1,
  justifyContent: 'space-between',
};

const customIconStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  objectFit: 'contain',
  marginInlineEnd: 16,
};

const customIconParentStyle = {
  ...customIconStyle,
  width: 18,
  height: 18,
};

export const createNavIconSrc = (name: string, isSelected: boolean) => {
  try {
    return require(`../../statics/navIcons/${name}${
      isSelected ? '-状态' : ''
    }.png`);
  } catch {
    return '';
  }
};

export const layoutSubMenuItemRender = (
  item: MenuDataItem & {
    isUrl: boolean;
  },
  defaultDom: React.ReactNode,
  menuProps: BaseMenuProps
) => {
  if (item.isUrl || !item.path) {
    return defaultDom;
  }
  const isSelected = !!menuProps.location?.pathname?.startsWith(item.path);
  const imgSrc = createNavIconSrc(item.iconName, isSelected);
  return (
    <span
      style={{
        ...customMenuItemStyle,
        ...(menuProps.collapsed && {
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }),
      }}
      onClick={() => history.push(item.path!)}
    >
      {imgSrc && (
        <img
          style={{
            ...customIconParentStyle,
            ...(menuProps.collapsed && {
              marginInlineEnd: -8,
            }),
          }}
          src={imgSrc}
        />
      )}
      {!menuProps.collapsed && defaultDom}
    </span>
  );
};

export const layoutMenuRender: ProLayoutProps['menuItemRender'] = (
  item,
  defaultDom,
  menuProps
) => {
  if (item.isUrl || !item.path) {
    return defaultDom;
  }
  const isSelected = !!menuProps.location?.pathname?.startsWith(item.path);
  const imgSrc = createNavIconSrc(item.iconName, isSelected);

  return (
    <Link to={item.redirectPath || item.path} style={customMenuItemStyle}>
      {imgSrc && <img style={customIconStyle} src={imgSrc} />}
      <span style={customMenuItemContentStyle}>
        {defaultDom}
        {item.onCollect &&
          !menuProps.collapsed &&
          item.pro_layout_parentKeys.length > 0 && (
            <Button
              type='text'
              style={{
                color: item.isCollected
                  ? '#EEA62E'
                  : themeConfig?.components?.Button?.colorTextDisabled,
              }}
              className='collection-icon'
              icon={item.isCollected ? <StarFilled /> : <StarOutlined />}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                item.onCollect();
              }}
            />
          )}
      </span>
    </Link>
  );
};
