import { ProDescriptions } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';

import { queryAddressList } from '@/services/api';

import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import {
  BlockChainNetTypeEnums,
  BlockChainTypeEnums,
  MemberAddressTypeEnums,
} from '@/services/enums';
import type { API } from '@/services/typings';
import { createNumberEnumsCol } from '@/utils/tableCols';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';

const SearchColWL = [
  'userName',
  'blockChainType',
  'blockChainNetType',
  'memberAddressType',
  'memberAddress',
];

const AddressList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.AddressItem>();

  const columns: ProColumns<API.AddressItem>[] = (
    [
      {
        title: '地址id',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
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
        title: '会员账号',
        dataIndex: 'userName',
      },
      createNumberEnumsCol({
        title: '区块链类型',
        dataIndex: 'blockChainType',
        valueEnum: BlockChainTypeEnums,
      }),
      createNumberEnumsCol({
        title: '网络类型',
        dataIndex: 'blockChainNetType',
        valueEnum: BlockChainNetTypeEnums,
      }),
      createNumberEnumsCol({
        title: '地址类型',
        dataIndex: 'memberAddressType',
        valueEnum: MemberAddressTypeEnums,
      }),
      {
        title: '地址',
        dataIndex: 'memberAddress',
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        width: 100,
        render: (_, record) => {
          return [
            <a
              key='record'
              onClick={() => {
                // handleEditFormVisible(true);
                setCurrentRow(record);
              }}
            >
              历史记录
            </a>,
          ];
        },
      },
    ] as ProColumns<API.AddressItem>[]
  ).map((col) => {
    return {
      hideInSearch:
        !col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
      ...col,
    };
  });

  return (
    <MyPageContainer>
      <MyTable<API.AddressItem, TableListPagination>
        actionRef={actionRef}
        rowKey='userName'
        request={queryAddressList}
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
        {currentRow?.userName && (
          <ProDescriptions<API.AddressItem>
            column={2}
            title={currentRow?.userName}
            dataSource={currentRow}
            columns={columns as ProDescriptionsItemProps<API.AddressItem>[]}
          />
        )}
      </Drawer>
    </MyPageContainer>
  );
};

export default AddressList;
