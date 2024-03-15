import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { queryGameSummaryList } from '@/services/api';

import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import type { API } from '@/services/typings';
import {
  createMerchantCodeCol,
  createMoneyCol,
  createMoneyCols,
} from '@/utils/tableCols';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { createReportQuickSelectTimeCol } from '../../../components/MyDateTimePicker/ReportQuickTimeSearch';
import GameSummaryRow from './components/GameSummaryRow';

const SearchColWL = ['gameTypeCode'];

const GameSummary: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [summaryInfo, setSummaryInfo] = useState<API.GameSummary>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.GameSummaryItem>();

  const columns: ProColumns<API.GameSummaryItem>[] = (
    [
      createReportQuickSelectTimeCol(),
      createMerchantCodeCol({
        title: '渠道名称',
      }),
      {
        title: '游戏名称',
        dataIndex: 'gameName',
        fixed: 'left',
        width: 140,
        render: (dom, entity) => {
          return (
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {dom}
            </a>
          );
        },
        search: {
          transform(value) {
            return {
              account: value,
            };
          },
        },
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
      ]),
      {
        title: '会员数量',
        dataIndex: 'userCount',
        width: 120,
      },
      createMoneyCol({
        title: '派彩金额',
        dataIndex: 'rewardAmount',
      }),
      {
        title: '投注笔数',
        dataIndex: 'count',
      },
      {
        title: '盈利笔数',
        dataIndex: 'winCount',
      },
      {
        title: '亏损笔数',
        dataIndex: 'lossCount',
      },
      ...createMoneyCols([
        {
          title: '会员输赢',
          dataIndex: 'memberWinLoss',
        },
        {
          title: '公司盈亏',
          dataIndex: 'companyWinLoss',
        },
      ]),
      {
        title: '游戏胜率',
        dataIndex: 'gameWinPercent',
      },
    ] as ProColumns<API.GameSummaryItem>[]
  ).map((col) => {
    return {
      hideInSearch:
        !col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
      ...col,
    };
  });

  return (
    access.REPORT_MANAGEMENT_GAME_01 && (
      <MyPageContainer>
        <MyTable<API.GameSummaryItem, TableListPagination>
          actionRef={actionRef}
          rowKey='gameName'
          scroll={{ x: 1800 }}
          request={async (params, ...rest) => {
            const data = await queryGameSummaryList(params, ...rest);
            setSummaryInfo(data.sumInfo);
            return data;
          }}
          columns={columns}
          rowSelection={false}
          summary={(pageData) => {
            const totalData = pageData.reduce(
              (res, item) => {
                res.totalBetAmount += item.betAmount;
                res.totalValidAmount += item.validAmount;
                // res.totalUserCount += item.userCount;
                res.totalRewardAmount += item.rewardAmount;
                res.totalCount += item.count;
                res.totalWinCount += item.winCount;
                res.totalLossCount += item.lossCount;
                res.totalMemberWinLoss += item.memberWinLoss;
                res.totalCompanyWinLoss += item.companyWinLoss;

                return res;
              },
              {
                totalBetAmount: 0,
                totalValidAmount: 0,
                totalUserCount: '-',
                totalRewardAmount: 0,
                totalCount: 0,
                totalWinCount: 0,
                totalLossCount: 0,
                totalMemberWinLoss: 0,
                totalCompanyWinLoss: 0,
              }
            );
            return (
              <ProTable.Summary>
                <GameSummaryRow
                  title='小计'
                  betAmount={totalData.totalBetAmount}
                  validAmount={totalData.totalValidAmount}
                  userCount={summaryInfo?.sumSmallUserCount || 0}
                  rewardAmount={totalData.totalRewardAmount}
                  count={totalData.totalCount}
                  winCount={totalData.totalWinCount}
                  lossCount={totalData.totalLossCount}
                  memberWinLoss={totalData.totalMemberWinLoss}
                  companyWinLoss={totalData.totalCompanyWinLoss}
                />
                <GameSummaryRow
                  title='合计'
                  betAmount={summaryInfo?.sumBetAmount}
                  validAmount={summaryInfo?.sumValidAmount}
                  userCount={summaryInfo?.sumUserCount}
                  rewardAmount={summaryInfo?.sumRewardAmount}
                  count={summaryInfo?.sumCount}
                  winCount={summaryInfo?.sumWinCount}
                  lossCount={summaryInfo?.sumLossCount}
                  memberWinLoss={summaryInfo?.sumMemberWinLoss}
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
          {currentRow?.gameName && (
            <ProDescriptions<API.GameSummaryItem>
              column={2}
              title={currentRow?.gameName}
              dataSource={currentRow}
              columns={
                columns as ProDescriptionsItemProps<API.GameSummaryItem>[]
              }
            />
          )}
        </Drawer>
      </MyPageContainer>
    )
  );
};

export default GameSummary;
