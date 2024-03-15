import type { ProColumns, RequestData } from '@ant-design/pro-components';

export interface PageTabProps<T = any> {
  showDetail: (detail: T, columns: ProColumns<T>[]) => void;
  closeDetail: () => void;
}

export type ProTableRequest<T = any, TableData = RequestData<T>> = (
  params: U & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, ReactText[] | null>,
) => Promise<Partial<TableData>>;

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type ProTableRequestParams = {
  pageSize?: number;
  current?: number;
  keyword?: string;
} & U;
