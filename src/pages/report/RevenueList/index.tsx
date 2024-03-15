import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { queryRevenueList } from '@/services/api';

import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import type { API } from '@/services/typings';
import { createMoneyCols } from '@/utils/tableCols';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { createReportQuickSelectTimeCol } from '../../../components/MyDateTimePicker/ReportQuickTimeSearch';
import RevenueSummaryRow from './components/RevenueSummaryRow';

const RevenueList: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [summaryInfo, setSummaryInfo] = useState<API.RevenueSummary>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RevenueItem>();
  const columns: ProColumns<API.RevenueItem>[] = (
    [
      createReportQuickSelectTimeCol(),
      {
        title: '渠道名称',
        dataIndex: 'merchantName',
        fixed: 'left',
        width: 170,
      },
      {
        title: '投注笔数',
        dataIndex: 'count',
      },
      ...createMoneyCols([
        {
          title: '投注金额',
          dataIndex: 'betAmount',
        },
        {
          title: '有效投注',
          dataIndex: 'validAmount',
        },
        {
          title: '派彩金额',
          dataIndex: 'rewardAmount',
        },
        {
          title: '渠道盈亏',
          dataIndex: 'companyWinLoss',
        },
      ]),
    ] as ProColumns<API.RevenueItem>[]
  ).map((col) => {
    return {
      hideInSearch: true,
      ...col,
    };
  });

  return (
    access.REPORT_MANAGEMENT_REVENUE_01 && (
      <MyPageContainer>
        <MyTable<API.RevenueItem, TableListPagination>
          actionRef={actionRef}
          rowKey='merchantName'
          scroll={{ x: 1000 }}
          request={async (params, ...rest) => {
            const data = await queryRevenueList(params, ...rest);
            setSummaryInfo(data.sumInfo);
            return data;
          }}
          columns={columns}
          rowSelection={false}
          summary={(pageData) => {
            const totalData = pageData.reduce(
              (res, item) => {
                res.totalCount += item.count;
                res.totalBetAmount += item.betAmount;
                res.totalValidAmount += item.validAmount;
                res.totalRewardAmount += item.rewardAmount;
                res.totalCompanyWinLoss += item.companyWinLoss;
                return res;
              },
              {
                totalCount: 0,
                totalBetAmount: 0,
                totalValidAmount: 0,
                totalRewardAmount: 0,
                totalCompanyWinLoss: 0,
              }
            );
            return (
              <ProTable.Summary>
                <RevenueSummaryRow
                  title='小计'
                  count={totalData.totalCount}
                  betAmount={totalData.totalBetAmount}
                  validAmount={totalData.totalValidAmount}
                  rewardAmount={totalData.totalRewardAmount}
                  companyWinLoss={totalData.totalCompanyWinLoss}
                />
                <RevenueSummaryRow
                  title='合计'
                  count={summaryInfo?.sumCount}
                  betAmount={summaryInfo?.sumBetAmount}
                  validAmount={summaryInfo?.sumValidAmount}
                  rewardAmount={summaryInfo?.sumRewardAmount}
                  companyWinLoss={summaryInfo?.sumCompanyWinLoss}
                />
              </ProTable.Summary>
            );
          }}
        />
        <Drawer
          width={600}
          open={showDetail}
          onClose={() => {
            setCurrentRow(undefined);
            setShowDetail(false);
          }}
          closable={false}
        >
          {currentRow?.merchantName && (
            <ProDescriptions<API.RevenueItem>
              column={2}
              title={currentRow?.merchantName}
              dataSource={currentRow}
              columns={columns as ProDescriptionsItemProps<API.RevenueItem>[]}
            />
          )}
        </Drawer>
      </MyPageContainer>
    )
  );
};

export default RevenueList;
