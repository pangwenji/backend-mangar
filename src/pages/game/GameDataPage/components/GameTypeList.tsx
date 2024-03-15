import { ProDescriptions } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, Drawer } from 'antd';
import React, { memo, useRef, useState } from 'react';
import EditGameTypeForm from './EditGameTypeForm';

import { queryGameTypeList } from '@/services/api';

import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import type { API } from '@/services/typings';
import { PlusOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { handleGameTypeAdd, handleGameTypeUpdate } from '../actions';

const GameTypeList: React.FC = () => {
  const access = useAccess();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GameTypeItem>();

  /** 编辑窗口的弹窗 */
  const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);

  const onEditFormFinish = async (typeInfo: API.GameTypeItem) => {
    let success;
    // update
    if (currentRow) {
      // 编辑分类信息
      success = await handleGameTypeUpdate(
        typeInfo as API.GameTypeEditItem,
        currentRow
      );
    } else {
      // create
      success = await handleGameTypeAdd(typeInfo);
    }
    // 成功后都需要关闭编辑窗口, 刷新数据
    if (success) {
      setCurrentRow(undefined);
      handleEditFormVisible(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };
  const onEditFormCancel = () => {
    handleEditFormVisible(false);
    if (currentRow) {
      setCurrentRow(undefined);
    }
  };

  const columns: ProColumns<API.GameTypeItem>[] = (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        // fixed: 'left',
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
        title: '游戏类型',
        dataIndex: 'gameTypeName',
      },
      {
        title: '图标',
        dataIndex: 'iconUrl',
        valueType: 'image',
        width: 200,
        ellipsis: false,
      },
      {
        title: '类型描述',
        dataIndex: 'remark',
      },
      access.GAME_MANAGEMENT_DATA_02 && {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        width: 100,
        render: (_, record) => (
          <a
            key='config'
            onClick={() => {
              handleEditFormVisible(true);
              setCurrentRow(record);
            }}
          >
            编辑
          </a>
        ),
      },
    ] as ProColumns<API.GameTypeItem>[]
  )
    .filter(Boolean)
    .map((col) => {
      return {
        ellipsis: true,
        ...col,
      };
    });
  return (
    <>
      <MyTable<API.GameTypeItem, TableListPagination>
        actionRef={actionRef}
        search={false}
        scroll={{ x: 1000 }}
        request={queryGameTypeList}
        columns={columns}
        toolBarRender={() => [
          access.GAME_MANAGEMENT_DATA_02 && (
            <Button
              type='primary'
              key='create-item'
              onClick={() => {
                handleEditFormVisible(true);
              }}
            >
              <PlusOutlined /> 新建
            </Button>
          ),
        ]}
      />
      <EditGameTypeForm
        open={editFormVisible}
        onOpenChange={(visible) => {
          if (showDetail && visible) {
            setShowDetail(false);
          }
        }}
        onFinish={onEditFormFinish}
        modalProps={{ onCancel: onEditFormCancel }}
        initialValues={currentRow}
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
          <ProDescriptions<API.GameTypeItem>
            column={2}
            title={currentRow.gameTypeName}
            dataSource={currentRow}
            columns={columns as ProDescriptionsItemProps<API.GameTypeItem>[]}
          />
        )}
      </Drawer>
    </>
  );
};
export default memo(GameTypeList);
