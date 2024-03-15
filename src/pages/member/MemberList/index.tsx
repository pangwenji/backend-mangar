import { ProDescriptions, ProTable } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { queryMemberList } from '@/services/api';

import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import { SwitchStatusEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import {
	createMerchantCodeCol,
	createMoneyCol,
	createMoneyCols,
	createQuickSelectTimeCol,
	createTimeCol,
} from '@/utils/tableCols';
import type {
	ActionType,
	ProColumns,
	ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import useToken from 'antd/es/theme/useToken';
import MemberSummaryRow from './components/MemberSummaryRow';

const SearchColWL = ['accountName'];

const MemberList: React.FC = () => {
	const access = useAccess();
	const token = useToken()[1];
	const actionRef = useRef<ActionType>();
	const [summaryInfo, setSummaryInfo] = useState<API.MemberListSummary>();
	const [showDetail, setShowDetail] = useState<boolean>(false);
	const [currentRow, setCurrentRow] = useState<API.MemberItem>();
	const columns: ProColumns<API.MemberItem>[] = (
		[
			{
				title: 'ID',
				dataIndex: 'id',
				fixed: 'left',
				width: 120,
				ellipsis: false,
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
			},
			createMerchantCodeCol(),
			{
				title: '会员账号',
				dataIndex: 'accountName',
				colSize: 5,
			},
			{
				title: '三方用户id',
				dataIndex: 'thirdId',
			},
			{
				title: '渠道名稱',
				dataIndex: 'merchantName',
			},
			createQuickSelectTimeCol({ title: '时间范围' }),
			...createMoneyCols([
				{
					title: '投注金额',
					dataIndex: 'betAmount',
				},
				{
					title: '输赢金额',
					dataIndex: 'winLossAmount',
				},
			]),
			/* {
        title: '注册渠道',
        dataIndex: 'fromType',
      }, */
			createTimeCol({
				title: '注册时间',
				dataIndex: 'createTime',
				valueType: 'dateTime',
				ellipsis: true,
				width: 170,
			}),
			createMoneyCol({
				title: '用户余额',
				dataIndex: 'balance',
			}),
			/* {
        title: '币种信息',
        dataIndex: 'currency',
      }, */
			{
				title: '在线状态',
				dataIndex: 'onlineStatus',
				width: 120,
				ellipsis: false,
				render(_, entity) {
					if (entity.onlineStatus) return '在线';
					return '离线';
				},
			},
			{
				title: '会员状态',
				dataIndex: 'isValidity',
				valueEnum: SwitchStatusEnums,
				width: 120,
				ellipsis: false,
			},
			/*  (access.MEMBER_CENTER_PAGE_OFFLINE || access.MEMBER_CENTER_PAGE_02) && {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        width: 170,
        render: (_, record) => {
          const isValidity = record.isValidity;
          const changeText = isValidity ? '禁用' : '启用';
          const canOffline =
            access.MEMBER_CENTER_PAGE_OFFLINE && record.onlineStatus;
          const canSwitch = access.MEMBER_CENTER_PAGE_02;
          return [
            <MyModalWrapper
              key='force-offline'
              content={`确定要强制当前玩家下线吗`}
              onFinish={async () => {
                setShowDetail(false);
                if (await handleMemberOffline(record)) {
                  actionRef.current?.reload?.();
                  return true;
                }
              }}
            >
              <Button type='primary' disabled={!canOffline}>
                强制下线
              </Button>
            </MyModalWrapper>,
            <MyModalWrapper
              key='change-status'
              content={
                <>
                  确定要
                  {
                    <span
                      style={{
                        color: isValidity ? token.colorError : token.colorLink,
                      }}
                    >
                      {changeText}
                    </span>
                  }
                  当前会员吗
                </>
              }
              onFinish={async () => {
                setShowDetail(false);
                if (await handleMemberStatusChange(record)) {
                  actionRef.current?.reload?.();
                  return true;
                }
              }}
            >
              <Button
                disabled={!canSwitch}
                {...(isValidity
                  ? {
                      type: 'text',
                      danger: true,
                    }
                  : { type: 'link' })}
              >
                {changeText}
              </Button>
            </MyModalWrapper>,
          ];
        },
      }, */
		] as ProColumns<API.MemberItem>[]
	)
		.filter(Boolean)
		.map((col) => {
			return {
				ellipsis: true,
				hideInSearch:
					!col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
				...col,
			};
		});

	return (
		<MyPageContainer>
			<MyTable<API.MemberItem, TableListPagination>
				actionRef={actionRef}
				rowKey='id'
				scroll={{ x: 1500, y: '58vh' }}
				request={async (...params) => {
					const result = await queryMemberList(...params);
					setSummaryInfo(result.sumInfo);
					return result;
				}}
				columns={columns}
				rowSelection={false}
				form={{
					ignoreRules: false,
				}}
				summary={(pageData) => {
					const totalData = pageData.reduce(
						(res, item) => {
							res.totalBetAmount += item.betAmount;
							res.totalWinLossAmount += item.winLossAmount;
							res.totalBalance += item.balance;
							return res;
						},
						{
							totalBetAmount: 0,
							totalWinLossAmount: 0,
							totalBalance: 0,
						}
					);
					return (
						<ProTable.Summary fixed>
							<MemberSummaryRow
								title='小计'
								betAmount={totalData.totalBetAmount}
								winLossAmount={totalData.totalWinLossAmount}
								balance={totalData.totalBalance}
							/>
							<MemberSummaryRow
								title='合计'
								betAmount={summaryInfo?.sumBetAmount}
								winLossAmount={summaryInfo?.sumWinLossAmount}
								balance={summaryInfo?.sumBalance}
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
				{currentRow?.id && (
					<ProDescriptions<API.MemberItem>
						column={2}
						title={currentRow.id}
						dataSource={currentRow}
						columns={columns as ProDescriptionsItemProps<API.MemberItem>[]}
					/>
				)}
			</Drawer>
		</MyPageContainer>
	);
};

export default MemberList;
