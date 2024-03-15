import type { VideoCategory } from '@/services/enums';
import type { API } from '@/services/typings';
import type { ProgressProps } from 'antd';

export type UploadWinInfo = {
  percent?: number;
  status?: ProgressProps['status'];
  type: VideoCategory;
  errMsg?: string;
  path?: string;
  forceSubmit?: boolean;
  pending?: boolean;
  submitting?: boolean;
};

export type UploadWinItem = Partial<API.MovieItem | API.VideoTableItem> & {
  winInfo: UploadWinInfo;
  id: number;
};
