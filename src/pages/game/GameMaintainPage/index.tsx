import { ProCard } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

import { handleGameStatusUpdate } from './actions';

import { CustomCommonBG } from '@/../config/theme';
import MyPageContainer from '@/components/MyPageContainer';
import { queryGameStatusList } from '@/services/api';
import { GameStatus } from '@/services/enums';
import type { API } from '@/services/typings';
import { useAccess, useModel } from '@umijs/max';
import { message, Space, Spin } from 'antd';
import MaintainPlanList from './components/MaintainPlanList';
import StatusButtonGroup from './components/StatusButtonGroup';

const GameStatusList: React.FC = () => {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const lotteryMenu = initialState?.lotteryMenu;
  const [gameData, setGameData] = useState<API.GameStatusListData>();
  const [processingKeys, setProcessingKeys] = useState<number[]>([]);

  useEffect(() => {
    access.GAME_MANAGEMENT_MAINTEN_01 &&
      queryGameStatusList()
        .then(setGameData)
        .catch(() => {})
        .finally(() => {});
  }, [access.GAME_MANAGEMENT_MAINTEN_01]);

  /** 编辑窗口的弹窗 */
  const handleOnChange = async (
    status: GameStatus,
    game: API.GameStatusItem,
    key: string
  ) => {
    if (!gameData) return;
    setProcessingKeys([...new Set([...processingKeys, game.id])]);
    let targetGameList = gameData[key];
    let targetGameIndex = targetGameList.findIndex(
      (item) => item.id === game.id
    );
    const targetGame = targetGameList[targetGameIndex];
    if (targetGameIndex > -1) {
      targetGameList[targetGameIndex] = {
        ...targetGame,
        isValidity: status,
      };
    }
    setGameData({
      ...gameData,
      [key]: [...targetGameList],
    });
    const success = await handleGameStatusUpdate({
      isValidity: status,
      id: game.id,
    });
    if (!success) {
      // 回退状态
      targetGameList[targetGameIndex] = targetGame;
      setGameData({
        ...gameData,
        [key]: [...targetGameList],
      });
    }
    setProcessingKeys(processingKeys.filter((key) => key !== game.id));
  };

  return (
    <MyPageContainer>
      <ProCard
        direction='column'
        gutter={0}
        style={{ marginBlockStart: 8 }}
        bodyStyle={{ padding: 0 }}
        bordered
      >
        {gameData ? (
          Object.keys(gameData).map((title) => {
            return (
              <ProCard
                title={title}
                key={title}
                type='inner'
                headStyle={{ backgroundColor: CustomCommonBG }}
                bodyStyle={{ paddingInline: 32 }}
              >
                <Space wrap size={[100, 30]}>
                  {gameData[title].map((game) => {
                    if (
                      lotteryMenu?.find(
                        (lottery) => lottery.lotteryName === game.gameName
                      )
                    ) {
                      return (
                        <StatusButtonGroup
                          onChange={async (status) => {
                            if (status === game.isValidity) return true;
                            if (access.GAME_MANAGEMENT_MAINTEN_02) {
                              await handleOnChange(status, game, title);
                              return true;
                            } else {
                              message.warning('此账号没有编辑权限');
                              return false;
                            }
                          }}
                          key={game.id}
                          game={game}
                          disabled={processingKeys.includes(game.id)}
                        />
                      );
                    }
                  })}
                </Space>
              </ProCard>
            );
          })
        ) : (
          <Spin style={{ width: '100%' }} />
        )}
      </ProCard>
      <MaintainPlanList />
    </MyPageContainer>
  );
};

export default GameStatusList;
