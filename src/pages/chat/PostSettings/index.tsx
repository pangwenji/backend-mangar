import React from 'react';

import MyPageContainer from '@/components/MyPageContainer';
import GameBanList from './components/GameBanList';
import MemberBanList from './components/MemberBanList';
import PostSettingList from './components/PostSettingList';

const PostSettings: React.FC = () => {
	return (
		<MyPageContainer>
			<PostSettingList />
			<GameBanList />
			<MemberBanList />
		</MyPageContainer>
	);
};

export default PostSettings;
