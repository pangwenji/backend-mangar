import React from 'react';

import { useAccess } from '@umijs/max';

import MyPageContainer from '@/components/MyPageContainer';
import CopyList from './components/CopyList';
import CustomServiceList from './components/CustomServiceList';
import TextImgList from './components/TextImgList';

import type { PageHeaderTabConfig } from '@ant-design/pro-layout/es/components/PageContainer';

const WebsitePage: React.FC = () => {
	const access = useAccess();
	return (
		<MyPageContainer
			tabList={
				[
					access.SYSTEM_MANAGEMENT_WEBSITE_LIST && {
						tab: '图文配置',
						key: 'textImg',
						children: <TextImgList />,
					},
					access.SYSTEM_MANAGEMENT_WEBSITE_CS_LIST && {
						tab: '客服配置',
						key: 'customService',
						children: <CustomServiceList />,
					},
					access.SYSTEM_MANAGEMENT_WEBSITE_COPY_LIST && {
						tab: '文案配置',
						key: 'copy',
						children: <CopyList />,
					},
				].filter(Boolean) as PageHeaderTabConfig['tabList']
			}
		/>
	);
};

export default WebsitePage;
