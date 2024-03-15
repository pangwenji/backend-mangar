import { API } from '@/services/typings';
import { basicMoneyFormat } from '@/utils/mics';
import { Card, Space, Typography } from 'antd';
import numeral from 'numeral';
import Field from '../Field';

const { Title } = Typography;

const personFormat = (money?: number) => {
  const moneyNum = Number(money);
  if (Number.isNaN(moneyNum)) {
    return '';
  } else {
    const parsedMoney = moneyNum;
    return numeral(parsedMoney).format('0,0');
  }
};

export interface IIntroduceProps {
  memberData?: API.DashboardInfo;
  loading?: boolean;
}

const IntroduceRow: React.FC<IIntroduceProps> = ({ memberData, loading }) => {
  const cardLoading = !memberData && loading;
  return (
    <Space direction='vertical' className='dashboard-introduce-row'>
      <Title level={5}>今日焦点</Title>
      <Space wrap size={20} className='introduce-card-list'>
        <Card loading={cardLoading}>
          <Field
            label='今日新增 (人)'
            value={personFormat(
              memberData?.playerStateInfo.todayPlayerIncNum || 0
            )}
            rate={memberData?.playerStateInfo.todayPlayerIncRate}
          />
          <Field
            label='会员总数 (人)'
            value={personFormat(
              memberData?.playerStateInfo.playerTotalNum || 0
            )}
          />
        </Card>
        <Card loading={cardLoading}>
          <Field
            label='今日投注 (元)'
            value={basicMoneyFormat(
              memberData?.betStateInfo.todayBetAmount || 0
            )}
            rate={memberData?.betStateInfo.todayBetRate}
          />
          <Field
            label='本月投注 (元)'
            value={basicMoneyFormat(
              memberData?.betStateInfo.monthBetAmount || 0
            )}
          />
        </Card>
        <Card loading={cardLoading}>
          <Field
            label='今日盈亏 (元)'
            value={basicMoneyFormat(
              memberData?.winLossStateInfo.todayWinLossAmount || 0
            )}
            rate={memberData?.winLossStateInfo.todayWinLossRate}
          />
          <Field
            label='本月盈亏 (元)'
            value={basicMoneyFormat(
              memberData?.winLossStateInfo.monthWinLossAmount || 0
            )}
          />
        </Card>
      </Space>
    </Space>
  );
};

export default IntroduceRow;
