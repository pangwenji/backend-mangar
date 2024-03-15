import { API } from '@/services/typings';
import { basicMoneyFormat } from '@/utils/mics';
import { ProTable } from '@ant-design/pro-components';
import React, { memo } from 'react';

interface IGameOrderSummaryRowProps extends Partial<API.GameOrderSummary> {
  title: string;
}

const GameOrderSummaryRow: React.FC<IGameOrderSummaryRowProps> = ({
  title,
  totalAmount,
  validAmount,
  runningAmount,
  returnAmount,
  rewardAmount,
  winLoseAmount,
}) => {
  return (
    <ProTable.Summary.Row>
      <ProTable.Summary.Cell align='center' index={0}>
        {title}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' colSpan={4} index={1}>
        -
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={1}>
        {basicMoneyFormat(totalAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={2}>
        {basicMoneyFormat(validAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' colSpan={2} index={3}>
        -
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={4}>
        {basicMoneyFormat(runningAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' colSpan={2} index={5}>
        -
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={6}>
        {basicMoneyFormat(returnAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={6}>
        {basicMoneyFormat(rewardAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={6}>
        {basicMoneyFormat(winLoseAmount, '-')}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' colSpan={2} index={6}>
        -
      </ProTable.Summary.Cell>
    </ProTable.Summary.Row>
  );
};
export default memo(GameOrderSummaryRow);
