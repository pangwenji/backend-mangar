import { updateCurrentAdminPWD } from '@/services/api';
import { API } from '@/services/typings';
import { ReactComponent as lockIcon } from '@/statics/imgs/lock.svg';
import { ReactComponent as logoutIcon } from '@/statics/imgs/logout.svg';
import { appLogout, getAuthToken } from '@/utils/authToken';
import encryptTools from '@/utils/encrypt';
import Icon from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { message, Spin } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import MyDropdown from '../MyDropdown';
import { ConfirmLogoutModal, EditPWDModal } from './modals';

type AvatarDropdownProps = {
	menu?: boolean;
	children?: React.ReactNode;
};

const menuIconStyle = { fontSize: 14, marginInlineEnd: 10 };
const menuItems = [
	{
		key: 'settings',
		icon: <Icon component={lockIcon} style={menuIconStyle} />,
		label: '修改密码',
	},
	{
		type: 'divider' as const,
	},
	{
		key: 'logout',
		icon: <Icon component={logoutIcon} style={menuIconStyle} />,
		label: '退出登录',
	},
].filter(Boolean) as MenuProps['items'];

export const AvatarDropdown: React.FC<AvatarDropdownProps> = () => {
	const actionClassName = useEmotionCss(({ token }) => {
		return {
			display: 'flex',
			height: '48px',
			marginLeft: 'auto',
			overflow: 'hidden',
			alignItems: 'center',
			padding: '0 8px',
			cursor: 'pointer',
			borderRadius: token.borderRadius,
			'&:hover': {
				backgroundColor: token.colorBgTextHover,
			},
		};
	});
	const [openPWD, setOpenPWD] = useState(false);

	const [openLogout, setOpenLogout] = useState(false);
	const currentAdmin = getAuthToken();

	const loading = (
		<span className={actionClassName}>
			<Spin
				size='small'
				style={{
					marginLeft: 8,
					marginRight: 8,
				}}
			/>
		</span>
	);

	const onMenuClick = useCallback(async (event: MenuInfo) => {
		const { key } = event;
		switch (key) {
			case 'logout':
				setOpenLogout(true);
				return;
			case 'settings':
				setOpenPWD(true);
				return;
			default:
				return;
		}
	}, []);

	// if (!initialState || !currentAdmin?.id) {
	if (!getAuthToken()) {
		return loading;
	}

	const handleLogout = async () => {
		if (await appLogout()) {
			setOpenLogout(false);
		}
	};

	const handleUpdatePWD = async (fields: API.UpdateCurrentAdminPWDParams) => {
		try {
			await updateCurrentAdminPWD({
				oldPwd: encryptTools.RSAencrypt(fields.oldPwd),
				newPwd: encryptTools.RSAencrypt(fields.newPwd),
			});
			message.success(
				'当前管理员密码更改成功，将自动跳转登录页面，请重新登录',
				3,
				() => {
					appLogout();
				}
			);
			setOpenPWD(false);
		} catch {
			// message.error('当前管理员密码更改失败，请重试');
		}
	};

	return (
		<>
			<MyDropdown
				menu={{
					selectedKeys: [],
					onClick: onMenuClick,
					items: menuItems,
				}}
				overlayStyle={{ top: 63 }}
				spaceProps={{ align: 'center' }}
			>
				<>
					{/* <Avatar size={28} /> */}
					{currentAdmin?.userName || '管理员'}
				</>
			</MyDropdown>
			<EditPWDModal
				open={openPWD}
				onFinish={handleUpdatePWD}
				onOpenChange={setOpenPWD}
			/>
			<ConfirmLogoutModal
				open={openLogout}
				onOpenChange={setOpenLogout}
				onFinish={handleLogout}
			/>
		</>
	);
};
