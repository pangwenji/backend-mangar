import { basicMoneyFormat } from '@/utils/mics';
import { ProTable } from '@ant-design/pro-components';
import React, { memo } from 'react';

interface IMemberSummaryRowProps {
  betAmount?: number;
  winLossAmount?: number;
  balance?: number;
  title: string;
}

const MemberSummaryRow: React.FC<IMemberSummaryRowProps> = ({
  betAmount,
  winLossAmount,
  balance,
  title,
}) => {
  return (
    <ProTable.Summary.Row>
      <ProTable.Summary.Cell align='center' index={0}>
        {title}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' colSpan={3} index={1}>
        -
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={1}>
        {basicMoneyFormat(betAmount) || '-'}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={2}>
        {basicMoneyFormat(winLossAmount) || '-'}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={3}>
        -
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' index={4}>
        {basicMoneyFormat(balance) || '-'}
      </ProTable.Summary.Cell>
      <ProTable.Summary.Cell align='center' colSpan={3} index={5}>
        -
      </ProTable.Summary.Cell>
    </ProTable.Summary.Row>
  );
};
export default memo(MemberSummaryRow);
