import { ProDescriptions } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { querySystemLogList } from '@/services/api';

import MyTable from '@/components/MyTable';
import { LoginUserType } from '@/services/enums';
import type { API } from '@/services/typings';
import { createTimeCol } from '@/utils/tableCols';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';

const SearchColWL = ['userName'];

const SystemLogList: React.FC<{ platform: LoginUserType }> = ({ platform }) => {
  const access = useAccess();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.SystemLogItem>();

  const columns: ProColumns<API.SystemLogItem>[] = (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        fixed: 'left',
        width: 160,
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
      {
        title: '系统信息',
        dataIndex: 'sysName',
      },
      {
        title: '访问实例',
        dataIndex: 'targetServer',
      },
      {
        title: '路由信息',
        dataIndex: 'routeInfo',
      },
      {
        title: '操作用户ID',
        dataIndex: 'optUserId',
      },
      {
        title: '操作用户名',
        dataIndex: 'userName',
      },
      {
        title: '请求类型',
        dataIndex: 'httpMethod',
      },
      {
        title: '请求路径',
        dataIndex: 'url',
      },
      {
        title: 'ip地址',
        dataIndex: 'ipAddress',
      },
      /*  {
        title: '定位城市',
        dataIndex: 'location',
      }, */
      {
        title: '请求数据类型',
        dataIndex: 'contentType',
      },
      {
        title: '请求头',
        dataIndex: 'requestHeader',
      },
      {
        title: '请求参数',
        dataIndex: 'params',
      },
      {
        title: '响应结果',
        dataIndex: 'resultJson',
      },
      {
        title: '请求耗时-毫秒',
        dataIndex: 'timeCost',
      },
      createTimeCol({
        title: '请求时间',
        dataIndex: 'createTime',
      }),
    ] as ProColumns<API.SystemLogItem>[]
  )
    .filter(Boolean)
    .map((col) => {
      return {
        hideInSearch:
          !col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
        ellipsis: true,
        ...col,
      };
    });

  return (
    access.LOG_MANAGEMENT_SYS_01 && (
      <>
        <MyTable<API.SystemLogItem, any>
          actionRef={actionRef}
          params={{ platform }}
          request={querySystemLogList}
          scroll={{ x: 2700 }}
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
            <ProDescriptions<API.SystemLogItem>
              column={1}
              title='日志详情'
              dataSource={currentRow}
              columns={columns as ProDescriptionsItemProps<API.SystemLogItem>[]}
            />
          )}
        </Drawer>
      </>
    )
  );
};

export default SystemLogList;
