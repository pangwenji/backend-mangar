import { ProTable, ProTableProps } from '@ant-design/pro-components';
import type { ParamsType } from '@ant-design/pro-provider';
import { TablePaginationConfig } from 'antd';
import { memo } from 'react';
import './index.less';

type TableFunc = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text'
>(
  props: ProTableProps<DataType, Params, ValueType>
) => JSX.Element;

const Pagination: TablePaginationConfig = {
  showQuickJumper: true,
  showSizeChanger: false,
  // @ts-ignore
  showTotal: false,
  defaultPageSize: 10,
  size: 'default',
};
const MyTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text'
>({
  scroll,
  columns,
  search,
  ...props
}: ProTableProps<DataType, Params, ValueType>) => {
  return (
    <ProTable<DataType, Params, ValueType>
      bordered={false}
      revalidateOnFocus={false}
      rowKey='id'
      scroll={{ x: 1200, y: '70vh', ...scroll }}
      pagination={Pagination}
      search={
        search === false
          ? false
          : {
              labelWidth: 'auto',
              collapsed: false,
              collapseRender: false,
              span: 24,
              optionRender(_, _1, domList) {
                return domList.reverse();
              },
              ...search,
            }
      }
      columns={columns?.map(({ formItemProps, fieldProps, ...col }) => {
        return {
          align: 'center',
          fieldProps: (form, config, ...params) => {
            const customProps =
              typeof fieldProps === 'function'
                ? fieldProps(form, config, ...params)
                : fieldProps;
            return {
              ...((!config.valueType || config.valueType === 'text') &&
                !config.valueEnum && {
                  placeholder: `请输入${config.title}`,
                }),
              ...customProps,
            };
          },
          formItemProps:
            typeof formItemProps === 'function'
              ? (...params) => {
                  const result = formItemProps(...params);
                  return {
                    colon: false,
                    ...result,
                  };
                }
              : {
                  colon: false,
                  ...formItemProps,
                },
          ...col,
        };
      })}
      {...props}
    />
  );
};

export default memo(MyTable) as TableFunc;
