import { basicMoneyFormat } from '@/utils/mics';
import { ProTable } from '@ant-design/pro-components';
import React, { memo } from 'react';

interface IRevenueSummaryRowProps {
  count?: number;
  betAmount?: number;
  validAmount?: number;
  rewardAmount?: number;
  companyWinLoss?: number;
  title: string;
}

const RevenueSummaryRow: React.FC<IRevenueSummaryRowProps> = ({
  count,
  betAmount,
  validAmount,
  rewardAmount,
  companyWinLoss,
  title,
}) => {
  return (
    <ProTable.Summary.Row>
      <ProTable.Summary.Cell align='center' index={0}>
        {title}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={1}>
        {count || 0}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={2}>
        {basicMoneyFormat(betAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={3}>
        {basicMoneyFormat(validAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={4}>
        {basicMoneyFormat(rewardAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={5}>
        {basicMoneyFormat(companyWinLoss, '-')}
      </ProTable.Summary.Cell>
    </ProTable.Summary.Row>
  );
};
export default memo(RevenueSummaryRow);
