import dayjs, { ConfigType } from 'dayjs';
// import timezonePlugin from 'dayjs/plugin/timezone';
// import utcPlugin from 'dayjs/plugin/utc';

// dayjs.extend(utcPlugin);
// dayjs.extend(timezonePlugin);

export const TimeFormatConsts = {
  DateTime: 'YYYY-MM-DD HH:mm:ss',
  Date: 'YYYY-MM-DD',
};

const timeFormat = (
  time: ConfigType,
  format: string = TimeFormatConsts.DateTime
) => {
  return dayjs(time).format(format);
};

export default timeFormat;
