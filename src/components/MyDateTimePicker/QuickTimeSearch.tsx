import { DatePicker, Select, SelectProps, Space } from 'antd';

import type { RangePickerDateProps } from 'antd/es/date-picker/generatePicker';
import classNames from 'classnames';
import type { Dayjs } from 'dayjs';
import { memo, useCallback, useEffect, useState } from 'react';
import { getQuickTimeDistance, QuickTimeType } from './tools';

const { RangePicker } = DatePicker;

const options = [
  { value: QuickTimeType.Today, label: QuickTimeType.Today },
  { value: QuickTimeType.Yesterday, label: QuickTimeType.Yesterday },
  { value: QuickTimeType.Week, label: QuickTimeType.Week },
  { value: QuickTimeType.Month, label: QuickTimeType.Month },
];

type QuickTimeSearchProps = RangePickerDateProps<Dayjs> & {
  defaultTimeType?: QuickTimeType;
  beforeTimeRangeRender?: () => React.ReactNode;
  wrapperClassname?: string;
};

const FieldName = '_my-quick-select-time';

export const QuickTimeConsts = {
  get TodayValue() {
    return getQuickTimeDistance(QuickTimeType.Today);
  },
  get YesterdayValue() {
    return getQuickTimeDistance(QuickTimeType.Yesterday);
  },
  get WeekValue() {
    return getQuickTimeDistance(QuickTimeType.Week);
  },
  get MonthValue() {
    return getQuickTimeDistance(QuickTimeType.Month);
  },
  FieldName,
};

const RangeFormart = 'YYYY-MM-DD HH:mm:ss';
const ShowTimeConfig = { format: 'HH:mm:ss' };

const QuickTimeSearch: React.FC<QuickTimeSearchProps> = ({
  value,
  onChange,
  defaultTimeType,
  beforeTimeRangeRender,
  wrapperClassname,
  ...props
}) => {
  const [timeType, setTimeType] = useState<QuickTimeType | undefined>(
    defaultTimeType
  );

  const syncTimeType = useCallback(
    (timeRange: QuickTimeSearchProps['value']) => {
      if (timeRange?.length) {
        // 同步时间类型
        if (
          timeRange[0]!.isSame(QuickTimeConsts.TodayValue![0], 'second') &&
          timeRange[1]!.isSame(QuickTimeConsts.TodayValue![1], 'second')
        ) {
          setTimeType(QuickTimeType.Today);
        } else if (
          timeRange[0]!.isSame(QuickTimeConsts.YesterdayValue![0], 'second') &&
          timeRange[1]!.isSame(QuickTimeConsts.YesterdayValue![1], 'second')
        ) {
          setTimeType(QuickTimeType.Yesterday);
        } else if (
          timeRange[0]!.isSame(QuickTimeConsts.WeekValue![0], 'second') &&
          timeRange[1]!.isSame(QuickTimeConsts.WeekValue![1], 'second')
        ) {
          setTimeType(QuickTimeType.Week);
        } else if (
          timeRange[0]!.isSame(QuickTimeConsts.MonthValue![0], 'second') &&
          timeRange[1]!.isSame(QuickTimeConsts.MonthValue![1], 'second')
        ) {
          setTimeType(QuickTimeType.Month);
        }
      }
    },
    []
  );

  const localOnChange: QuickTimeSearchProps['onChange'] = (
    val,
    formatString
  ) => {
    onChange?.(val, formatString);
    setTimeType(undefined);
    // syncTimeType(val);
  };

  const handleSelectChange: SelectProps['onChange'] = (val) => {
    setTimeType(val);
    if (val) {
      const distanceVal = getQuickTimeDistance(val)!;
      onChange?.(distanceVal, [
        distanceVal[0]?.format(RangeFormart)!,
        distanceVal[1]?.format(RangeFormart)!,
      ]);
    } else {
      onChange?.(null, ['', '']);
    }
  };

  // 同步时间类型
  useEffect(() => {
    syncTimeType(value);
  }, [value, syncTimeType]);

  return (
    <Space
      direction='horizontal'
      className={classNames('quick-time-search', wrapperClassname)}
      size={0}
    >
      {beforeTimeRangeRender?.()}
      <RangePicker
        showTime={ShowTimeConfig}
        format={RangeFormart}
        value={value}
        onChange={localOnChange}
        style={props.style}
      />
      <Select
        placeholder='快捷时间'
        style={{ width: 100 }}
        onChange={handleSelectChange}
        // 今日、本周、本月
        options={options}
        value={timeType}
        allowClear
      />
    </Space>
  );
};

export default memo(QuickTimeSearch);
