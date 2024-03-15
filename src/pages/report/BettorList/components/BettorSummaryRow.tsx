import { basicMoneyFormat } from '@/utils/mics';
import { ProTable } from '@ant-design/pro-components';
import React, { memo } from 'react';

interface IBettorSummaryRowProps {
  count?: number;
  validAmount?: number;
  betAmount?: number;
  rewardAmount?: number;
  companyWinLoss?: number;
  memberWinLoss?: number;
  winCount?: number;
  lossCount?: number;
  title: string;
}

const BettorSummaryRow: React.FC<IBettorSummaryRowProps> = ({
  betAmount,
  validAmount,
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
        -
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={1}>
        {basicMoneyFormat(betAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={2}>
        {basicMoneyFormat(validAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={3}>
        {basicMoneyFormat(rewardAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={4}>
        {count}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={5}>
        {winCount}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={6}>
        {lossCount}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={7}>
        {basicMoneyFormat(memberWinLoss, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={8}>
        {basicMoneyFormat(companyWinLoss, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={9}>
        -
      </ProTable.Summary.Cell>
    </ProTable.Summary.Row>
  );
};
export default memo(BettorSummaryRow);
