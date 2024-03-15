import MyModalWrapper, {
  MyModalWrapperProps,
} from '@/components/MyModalWrapper';
import HighlightText from '@/components/MyModalWrapper/HighlightText';
import { GameStatus, GameStatusEnums } from '@/services/enums';
import { API } from '@/services/typings';
import { Avatar, Radio, RadioGroupProps, Space, Typography } from 'antd';
import useToken from 'antd/es/theme/useToken';
import React, { memo, PropsWithChildren } from 'react';
import '../index.less';
const { Title } = Typography;

type StatusCommonProps = {
  game: API.GameStatusItem;
};

const StatusModal: React.FC<
  PropsWithChildren<
    { status: GameStatus } & StatusCommonProps &
      Omit<MyModalWrapperProps, 'content'>
  >
> = ({ game, status, children, ...props }) => {
  const token = useToken()[1];
  const statusColor = {
    [GameStatus.Open]: token.colorPrimary,
    [GameStatus.Maintaining]: token.colorSuccess,
    [GameStatus.Closed]: token.colorWarning,
    [GameStatus.Hidden]: token.colorError,
  };
  return (
    <MyModalWrapper
      content={
        <div>
          确认要把
          <HighlightText>
            "{`${game.gameTypeName}-${game.gameName}`}"
          </HighlightText>
          <br />
          的状态改为
          <span style={{ color: statusColor[status] }}>
            {GameStatusEnums[status]}
          </span>
          吗？
        </div>
      }
      {...props}
    >
      {children}
    </MyModalWrapper>
  );
};

const StatusButtonGroup: React.FC<
  Omit<RadioGroupProps, 'onChange'> &
    StatusCommonProps & { onChange: (status: GameStatus) => Promise<boolean> }
> = ({ game, onChange, ...props }) => {
  return (
    <Space align='center'>
      <Avatar src={game.iconUrl} />
      <Title level={5} style={{ width: '6em', margin: 0 }}>
        {game.gameName}
      </Title>
      <Radio.Group
        rootClassName='status-button-group'
        defaultValue={game.isValidity}
        buttonStyle='solid'
        value={game.isValidity}
        {...props}
      >
        {[
          GameStatus.Open,
          GameStatus.Maintaining,
          GameStatus.Closed,
          GameStatus.Hidden,
        ].map((status) => {
          return (
            <StatusModal
              key={status}
              status={status}
              game={game}
              onFinish={() => {
                return onChange(status);
              }}
            >
              <Radio.Button value={status}>
                {GameStatusEnums[status]}
              </Radio.Button>
            </StatusModal>
          );
        })}
      </Radio.Group>
    </Space>
  );
};
export default memo(StatusButtonGroup);
