import QuickTimeSearch, {
  QuickTimeConsts,
} from '@/components/MyDateTimePicker/QuickTimeSearch';
import { createOnlySearchCol } from '@/utils/tableCols';
import timeFormat from '@/utils/timeFormat';
import { ProColumns, SearchTransformKeyFn } from '@ant-design/pro-components';
import { Select } from 'antd';
import type { RangePickerDateProps } from 'antd/es/date-picker/generatePicker';
import type { Dayjs } from 'dayjs';
import React from 'react';
import { QuickTimeType } from './tools';

// 0-投注，1-结算
const enum ReportTimeType {
  Bet = 0,
  Settle = 1,
}

const TimeOptions = [
  { value: ReportTimeType.Bet, label: '投注时间' },
  { value: ReportTimeType.Settle, label: '结算时间' },
];

type SearchValue = {
  timeRange: RangePickerDateProps<Dayjs>['value'];
  timeType?: ReportTimeType;
};

const ReportQuickTimeSearch: React.FC<
  Omit<RangePickerDateProps<Dayjs>, 'value' | 'onChange'> & {
    value: SearchValue;
    onChange?(data: SearchValue): void;
  }
> = ({ value, onChange, ...props }) => {
  return (
    <QuickTimeSearch
      {...props}
      value={value?.timeRange}
      onChange={(range) => {
        onChange?.({
          ...value,
          timeRange: range,
        });
      }}
      beforeTimeRangeRender={() => {
        return (
          <Select
            style={{ width: 100 }}
            onChange={(typeCode) => {
              onChange?.({
                ...value,
                timeType: typeCode,
              });
            }}
            // 今日、本周、本月
            options={TimeOptions}
            defaultValue={value?.timeType || ReportTimeType.Bet}
            allowClear={false}
          />
        );
      }}
    />
  );
};

const timeSearchConfig: { transform: SearchTransformKeyFn } = {
  transform: ({ timeRange, timeType }: SearchValue) => {
    return {
      ...(timeRange?.length && {
        startTime: timeFormat(timeRange[0]),
        endTime: timeFormat(timeRange[1]),
      }),
      queryCode: timeType,
    };
  },
};

export const ReportQUickTimeSearchID = '__report-quick-search-time';

/* 快捷时间搜索 */
export const createReportQuickSelectTimeCol = <T extends Record<string, any>>(
  col?: ProColumns<T>,
  config?: { defaultTimeType: QuickTimeType | false }
): ProColumns<T> => {
  const defaultTimeType =
    config?.defaultTimeType === false ? false : QuickTimeType.Today;
  return createOnlySearchCol<T>({
    dataIndex: ReportQUickTimeSearchID,
    ...col,
    initialValue: {
      timeType: ReportTimeType.Bet,
      timeRange: !defaultTimeType
        ? undefined
        : defaultTimeType === QuickTimeType.Today
        ? QuickTimeConsts.TodayValue
        : defaultTimeType === QuickTimeType.Yesterday
        ? QuickTimeConsts.YesterdayValue
        : defaultTimeType === QuickTimeType.Week
        ? QuickTimeConsts.WeekValue
        : QuickTimeConsts.MonthValue,
    } as SearchValue,
    formItemProps: {
      rootClassName: 'no-label-search-item',
    },
    renderFormItem(_, { type, defaultRender, ...props }) {
      if (type === 'form') {
        return null;
      }
      // @ts-ignore
      return <ReportQuickTimeSearch {...props} />;
    },
    search: timeSearchConfig,
  });
};
