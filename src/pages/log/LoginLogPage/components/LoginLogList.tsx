import { ProDescriptions } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { queryLoginLogList } from '@/services/api';
import { createTimeRangeSearchCols } from '@/utils/tableCols';

import MyTable from '@/components/MyTable';
import { LoginUserType, SuccessEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';

const SearchColWL = ['userName'];

const LoginLogList: React.FC<{ platform: LoginUserType }> = ({ platform }) => {
  const access = useAccess();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.LoginLogItem>();

  const columns: ProColumns<API.LoginLogItem>[] = (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        fixed: 'left',
        width: 160,
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
        title: '用户名称',
        dataIndex: 'userName',
        width: 120,
      },
      {
        title: '用户ID',
        dataIndex: 'userId',
        width: 120,
      },
      {
        title: '域名信息',
        dataIndex: 'domainName',
      },
      {
        title: '客户端ip地址',
        dataIndex: 'ipAddr',
      },
      {
        title: 'ip类型',
        dataIndex: 'ipType',
        width: 100,
      },
      {
        title: '城市定位',
        dataIndex: 'locationCity',
      },
      {
        title: '客户端类型',
        dataIndex: 'clientType',
        width: 140,
      },
      {
        title: '登录状态',
        dataIndex: 'isSuccess',
        valueEnum: SuccessEnums,
        width: 100,
      },
      {
        title: '登录信息',
        dataIndex: 'remark',
      },
      ...createTimeRangeSearchCols({
        title: '登陆时间',
        dataIndex: 'createTime',
        valueType: 'dateTime',
      }),
    ] as ProColumns<API.LoginLogItem>[]
  )
    .filter(Boolean)
    .map((col) => {
      return {
        hideInSearch:
          !col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
        ...col,
      };
    });

  return (
    access.LOG_MANAGEMENT_LOGIN_01 && (
      <>
        <MyTable<API.LoginLogItem, any>
          actionRef={actionRef}
          params={{ platform }}
          request={queryLoginLogList}
          scroll={{ x: 1700 }}
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
            <ProDescriptions<API.LoginLogItem>
              column={2}
              title={currentRow?.userName}
              dataSource={currentRow}
              columns={columns as ProDescriptionsItemProps<API.LoginLogItem>[]}
            />
          )}
        </Drawer>
      </>
    )
  );
};

export default LoginLogList;
