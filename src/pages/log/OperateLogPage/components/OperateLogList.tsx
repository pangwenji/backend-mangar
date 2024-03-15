import { ProDescriptions } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { queryOperateLogList } from '@/services/api';

import MyTable from '@/components/MyTable';
import type { API } from '@/services/typings';
import { createTimeCol } from '@/utils/tableCols';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';

const SearchColWL = ['userName'];

const OperateLogList: React.FC = () => {
  const access = useAccess();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.OperateLogItem>();

  const columns: ProColumns<API.OperateLogItem>[] = (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        fixed: 'left',
        width: 150,
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

      {
        title: '管理员账号',
        dataIndex: 'userName',
        width: 150,
      },
      {
        title: '域名',
        dataIndex: 'domainName',
      },
      {
        title: '类型',
        dataIndex: 'module',
      },
      {
        title: '内容',
        dataIndex: 'operate',
      },
      {
        title: '请求参数',
        dataIndex: 'params',
        hideInTable: true,
      },
      {
        title: '响应信息',
        dataIndex: 'response',
        hideInTable: true,
      },
      {
        title: 'IP',
        dataIndex: 'ipAddress',
        width: 300,
        render(dom, entity) {
          if (entity.ipAddress) {
            return `${entity.ipAddress} ${entity.location}`;
          }
          return dom;
        },
      },
      createTimeCol({
        title: '时间',
        dataIndex: 'createTime',
      }),
    ] as ProColumns<API.OperateLogItem>[]
  )
    .filter(Boolean)
    .map((col) => {
      return {
        hideInSearch:
          !col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
        width: 200,
        ...col,
      };
    });

  return (
    access.LOG_MANAGEMENT_OPERATE_01 && (
      <>
        <MyTable<API.OperateLogItem, any>
          actionRef={actionRef}
          // params={{ platform }}
          request={queryOperateLogList}
          // scroll={{ x: 1500 }}
          columns={columns}
          rowSelection={false}
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
            <ProDescriptions<API.OperateLogItem>
              column={1}
              title='日志详情'
              dataSource={currentRow}
              columns={
                columns as ProDescriptionsItemProps<API.OperateLogItem>[]
              }
            />
          )}
        </Drawer>
      </>
    )
  );
};

export default OperateLogList;
