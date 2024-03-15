import dayjs, { Dayjs } from 'dayjs';
import type { RangeValue } from 'rc-picker/lib/interface';

export const enum QuickTimeType {
  Today = '今日',
  Yesterday = '昨天',
  Week = '本周',
  Month = '本月',
}

export function getQuickTimeDistance(type: QuickTimeType): RangeValue<Dayjs> {
  const now = new Date();
  const todayEnd = dayjs(now).endOf('day');
  // 本周
  if (type === QuickTimeType.Week) {
    const monday = dayjs(now).startOf('w');
    return [monday, todayEnd];
  } else if (type === QuickTimeType.Month) {
    const firstDate = dayjs(now).startOf('M');
    // 这个月 1 号到今天 23
    return [firstDate, todayEnd];
  } else if (type === QuickTimeType.Yesterday) {
    const yesterday = dayjs(now).subtract(1, 'day');
    return [yesterday.startOf('day'), yesterday.endOf('day')];
  } else {
    // 本日
    return [dayjs(now).startOf('day'), todayEnd];
  }
}
