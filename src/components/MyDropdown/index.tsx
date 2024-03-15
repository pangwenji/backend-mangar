import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Dropdown, Space, SpaceProps } from 'antd';
import type { DropDownProps } from 'antd/es/dropdown';
import classNames from 'classnames';
import React, { memo } from 'react';
import './index.less';

type HeaderDropdownProps = {
  overlayClassName?: string;
  spaceProps?: SpaceProps;
} & Omit<DropDownProps, 'overlay'>;

const MyDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  children,
  spaceProps,
  ...restProps
}) => {
  const className = useEmotionCss(({ token }) => {
    return {
      [`@media screen and (max-width: ${token.screenXS})`]: {
        width: '100%',
      },
      '.ant-dropdown-menu': {
        borderRadius: 6,
      },
    };
  });
  return (
    <Dropdown overlayClassName={classNames(className, cls)} {...restProps}>
      <Space rootClassName='my-dropdown-trigger' {...spaceProps}>
        {children}
        <div className='dorpdown-arrow'></div>
      </Space>
    </Dropdown>
  );
};

export default memo(MyDropdown);
