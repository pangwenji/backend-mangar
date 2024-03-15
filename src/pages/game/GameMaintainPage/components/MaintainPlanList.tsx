import { useAccess } from '@umijs/max';
import React, { memo, useRef, useState } from 'react';

import { queryGameMaintainPlanList } from '@/services/api';

import MyModalWrapper from '@/components/MyModalWrapper';
import MyTable from '@/components/MyTable';
import { MaintenancePeriodEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { isEqual } from 'lodash';
import {
  handleGameMaintainPlanAdd,
  handleGameMaintainPlanDelete,
  handleGameMaintainPlanUpdate,
} from '../actions';
import '../index.less';
import EditGameMaintainPlanForm from './EditGameMaintainPlanForm';

const MaintainPlanList: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GameMaintainPlanItem>();

  /** 编辑窗口的弹窗 */
  const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);

  const onEditFormCancel = () => {
    handleEditFormVisible(false);
    if (currentRow) {
      setCurrentRow(undefined);
    }
  };
  const onEditFormFinish = async (planInfo: API.GameMaintainPlanEditItem) => {
    let success;
    // update
    if (currentRow) {
      // 编辑分类信息
      const mergedPlanInfo = {
        ...currentRow,
        ...planInfo,
      };
      if (isEqual(mergedPlanInfo, currentRow)) {
        message.info('无变更内容');
        onEditFormCancel();
        return;
      } else {
        success = await handleGameMaintainPlanUpdate({
          id: currentRow.id,
          ...planInfo,
        } as API.GameMaintainPlanEditItem);
      }
    } else {
      // create
      success = await handleGameMaintainPlanAdd(planInfo);
    }
    // 成功后都需要关闭编辑窗口, 刷新数据
    if (success) {
      onEditFormCancel();
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const columns: ProColumns<API.GameMaintainPlanItem>[] = (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 125,
      },
      {
        title: '游戏名称',
        dataIndex: 'gameName',
      },
      {
        title: '维护周期',
        dataIndex: 'period',
        valueEnum: MaintenancePeriodEnums,
        width: 120,
      },
      {
        title: '维护开始时间',
        dataIndex: 'startTime',
      },
      {
        title: '维护结束时间',
        dataIndex: 'endTime',
      },
      (access.GAME_MANAGEMENT_PLAN_UPDATE ||
        access.GAME_MANAGEMENT_PLAN_DELETE) && {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        width: 110,
        render: (_, record) => {
          return [
            <Button
              key='config'
              onClick={() => {
                handleEditFormVisible(true);
                setCurrentRow(record);
              }}
              type='link'
              disabled={!access.GAME_MANAGEMENT_PLAN_UPDATE}
            >
              编辑
            </Button>,
            <MyModalWrapper
              content='确认要删除该维护计划?'
              onFinish={async () => {
                if (await handleGameMaintainPlanDelete(record)) {
                  actionRef.current?.reload();
                  return true;
                }
              }}
            >
              <Button
                danger
                type='text'
                disabled={!access.GAME_MANAGEMENT_PLAN_DELETE}
              >
                删除
              </Button>
            </MyModalWrapper>,
          ];
        },
      },
    ] as ProColumns<API.GameMaintainPlanItem>[]
  ).filter(Boolean);
  return (
    access.GAME_MANAGEMENT_PLAN_LIST && (
      <>
        <MyTable<API.GameMaintainPlanItem, any>
          headerTitle='维护计划'
          actionRef={actionRef}
          toolBarRender={() => [
            access.GAME_MANAGEMENT_PLAN_ADD && (
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
          request={queryGameMaintainPlanList}
          scroll={{ x: 1000 }}
          columns={columns}
          search={false}
          pagination={false}
        />
        <EditGameMaintainPlanForm
          open={editFormVisible}
          onFinish={onEditFormFinish}
          modalProps={{ onCancel: onEditFormCancel }}
          initialValues={currentRow}
        />
      </>
    )
  );
};
export default memo(MaintainPlanList);
