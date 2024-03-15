import { basicMoneyFormat } from '@/utils/mics';
import { ProTable } from '@ant-design/pro-components';
import React, { memo } from 'react';

interface IGameSummaryRowProps {
  betAmount?: number;
  validAmount?: number;
  userCount?: number | string;
  rewardAmount?: number;
  count?: number;
  winCount?: number;
  lossCount?: number;
  memberWinLoss?: number;
  companyWinLoss?: number;
  title: string;
}

const GameSummaryRow: React.FC<IGameSummaryRowProps> = ({
  betAmount,
  validAmount,
  userCount,
  rewardAmount,
  count,
  winCount,
  lossCount,
  memberWinLoss,
  companyWinLoss,
  title,
}) => {
  return (
    <ProTable.Summary.Row>
      <ProTable.Summary.Cell align='center' index={0}>
        {title}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={1}>
        {basicMoneyFormat(betAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={2}>
        {basicMoneyFormat(validAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={3}>
        {userCount}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={4}>
        {basicMoneyFormat(rewardAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={5}>
        {count}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={6}>
        {winCount}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={7}>
        {lossCount}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={8}>
        {basicMoneyFormat(memberWinLoss, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={9}>
        {basicMoneyFormat(companyWinLoss, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={10}>
        -
      </ProTable.Summary.Cell>
    </ProTable.Summary.Row>
  );
};
export default memo(GameSummaryRow);
