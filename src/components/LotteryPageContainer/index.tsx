import { useModel } from '@umijs/max';
import React, { memo } from 'react';

import MyPageContainer from '@/components/MyPageContainer';
import { API } from '@/services/typings';
import { PageContainerProps } from '@ant-design/pro-components';

const LotteryPageContainer: React.FC<
  {
    tabRender?(lottery: API.LotteryItem): React.ReactNode;
    tabListRender?: (
      lotteryMenu?: API.LotteryItem[]
    ) => PageContainerProps['tabList'];
  } & PageContainerProps
> = ({ tabRender, tabListRender, loading, ...props }) => {
  const { initialState } = useModel('@@initialState');
  const lotteryMenu = initialState?.lotteryMenu;
  return (
    <MyPageContainer
      {...props}
      loading={!lotteryMenu || loading}
      tabList={
        tabListRender
          ? tabListRender(lotteryMenu)
          : tabRender
          ? lotteryMenu?.map((menu) => {
              return {
                tab: menu.lotteryName,
                key: menu.lotteryCode,
                children: tabRender(menu),
              };
            })
          : undefined
      }
    ></MyPageContainer>
  );
};
export default memo(LotteryPageContainer);
