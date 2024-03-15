import { PlusOutlined } from '@ant-design/icons';
import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import EditRoleForm from './components/EditRoleForm';

import { queryRoleList } from '@/services/api';
import { useAccess } from '@umijs/max';
import { isEqual } from 'lodash';
import {
  handleRoleAdd,
  handleRoleMenus,
  handleRoleRemove,
  handleRoleUpdate,
  handleRoleUsers,
} from './actions';

import MyModalWrapper from '@/components/MyModalWrapper';
import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import { SwitchStatusEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import { appLogout, getAuthToken } from '@/utils/authToken';
import { createNumberEnumsCol } from '@/utils/tableCols';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { getExtraAuthInfoInRoleList } from '../utils';
import MenuTreeModal from './components/MenuTreeModal';
import UserTransferModal from './components/UserTransferModal';

const SearchColWL = ['name', 'isValidity'];

const RoleList: React.FC = () => {
  const access = useAccess();
  const currentAdmin = useRef(getAuthToken());
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RoleItem>();

  /** 编辑窗口的弹窗 */
  const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
  const onEditFormFinish = async (value: API.RoleEditItem) => {
    // console.log(' role => ', value);

    const adminRoleInfo = {
      ...currentRow,
      ...value,
    } as API.RoleEditItem;

    let success;
    // update
    if (currentRow) {
      const isChanged = !isEqual(adminRoleInfo, currentRow);
      // 有变动
      if (isChanged) {
        success = await handleRoleUpdate(adminRoleInfo, currentRow);
      } else {
        success = true;
        message.info('当前角色信息无任何改动');
      }
    } else {
      // create
      success = await handleRoleAdd(adminRoleInfo);
    }
    // 成功后都需要关闭编辑窗口, 刷新数据
    if (success) {
      handleEditFormVisible(false);
      setCurrentRow(undefined);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };
  const onEditFormCancel = () => {
    handleEditFormVisible(false);
    setCurrentRow(undefined);
  };

  /* 关联部分 */
  const [showMenuTree, setShowMenuTree] = useState(false);
  const [showUserTransfer, setShowUserTransfer] = useState(false);

  const columns: ProColumns<API.RoleItem>[] = (
    [
      {
        title: '角色ID',
        dataIndex: 'id',
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
        title: '角色编码',
        dataIndex: 'roleCode',
      },
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        ellipsis: true,
        valueType: 'textarea',
      },
      createNumberEnumsCol({
        title: '状态',
        dataIndex: 'isValidity',
        valueEnum: SwitchStatusEnums,
      }),
      (access.SYSTEM_MANAGEMENT_ROLE_05 ||
        access.SYSTEM_MANAGEMENT_ROLE_06) && {
        title: '关联',
        dataIndex: 'connection',
        valueType: 'option',
        ellipsis: false,
        width: 170,
        hideInDescriptions: true,
        render: (_, record) => {
          const { isCurrentSuper, isRecordSuper, isSameLevel } =
            getExtraAuthInfoInRoleList(record);
          const canShow = isRecordSuper ? false : !isSameLevel;
          const canConnectUser =
            canShow &&
            (isRecordSuper || !isSameLevel) &&
            access.SYSTEM_MANAGEMENT_ROLE_06;
          const canConnectMenu =
            canShow && !isRecordSuper && access.SYSTEM_MANAGEMENT_ROLE_05;
          return [
            <Button
              key='connect-user'
              type='link'
              onClick={() => {
                setShowUserTransfer(true);
                setCurrentRow(record);
              }}
              disabled={!canConnectUser}
            >
              关联用户
            </Button>,
            <Button
              key='connect-rule'
              type='link'
              onClick={() => {
                setShowMenuTree(true);
                setCurrentRow(record);
              }}
              disabled={!canConnectMenu}
            >
              关联资源
            </Button>,
          ];
        },
      },
      (access.SYSTEM_MANAGEMENT_ROLE_03 ||
        access.SYSTEM_MANAGEMENT_ROLE_04) && {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        width: 100,
        render: (_, record) => {
          const { isRecordSuper, isSameLevel } =
            getExtraAuthInfoInRoleList(record);
          const canShow = isRecordSuper ? false : !isSameLevel;
          const canEdit = canShow && access.SYSTEM_MANAGEMENT_ROLE_03;
          const canDelete =
            canShow && !isRecordSuper && access.SYSTEM_MANAGEMENT_ROLE_04;
          return [
            <Button
              key='config'
              onClick={() => {
                handleEditFormVisible(true);
                setCurrentRow(record);
              }}
              type='link'
              disabled={!canEdit}
            >
              编辑
            </Button>,
            <MyModalWrapper
              key='delete'
              content='确定要删除当前角色吗'
              onFinish={async () => {
                setShowDetail(false);
                if (await handleRoleRemove(record)) {
                  actionRef.current?.reload?.();
                  return true;
                }
              }}
            >
              <Button type='text' danger disabled={!canDelete}>
                删除
              </Button>
            </MyModalWrapper>,
          ];
        },
      },
    ] as ProColumns<API.RoleItem>[]
  )
    .filter(Boolean)
    .map((col) => {
      return {
        ...col,
        hideInSearch:
          !col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
      };
    });

  return (
    <MyPageContainer>
      {access.SYSTEM_MANAGEMENT_ROLE_01 && (
        <MyTable<API.RoleItem, TableListPagination>
          actionRef={actionRef}
          toolBarRender={() => [
            access.SYSTEM_MANAGEMENT_ROLE_02 && (
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
          request={queryRoleList}
          columns={columns}
          rowSelection={false}
        />
      )}
      <EditRoleForm
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
          <ProDescriptions<API.RoleItem>
            column={2}
            title={currentRow?.name}
            dataSource={currentRow}
            columns={columns as ProDescriptionsItemProps<API.RoleItem>[]}
          />
        )}
      </Drawer>
      <MenuTreeModal
        roleId={currentRow?.id}
        open={showMenuTree}
        onOpenChange={(open) => {
          if (!open) {
            setShowMenuTree(false);
            setCurrentRow(undefined);
          }
        }}
        onSave={async (menuIds: string[]) => {
          if (!currentRow?.id) return;
          if (await handleRoleMenus(currentRow?.id, menuIds)) {
            setShowMenuTree(false);
            setCurrentRow(undefined);
          }
        }}
      />
      <UserTransferModal
        open={showUserTransfer}
        onOpenChange={(open) => {
          if (!open) {
            setShowUserTransfer(false);
            setCurrentRow(undefined);
          }
        }}
        roleId={currentRow?.id}
        onConfirm={async ({ roleId, bindUsers, unbindUsers }) => {
          if (!roleId || (!bindUsers?.length && !unbindUsers?.length)) return;
          if (
            await handleRoleUsers({
              roleId,
              bindUsers,
              unbindUsers,
            })
          ) {
            if (
              currentAdmin.current &&
              (bindUsers?.includes(currentAdmin.current?.userId) ||
                unbindUsers?.includes(currentAdmin.current?.userId))
            ) {
              message.info(
                '更改了当前登录用户的角色信息，请重新登录',
                3,
                () => {
                  appLogout();
                }
              );
            }
            setShowUserTransfer(false);
            setCurrentRow(undefined);
          }
        }}
      />
    </MyPageContainer>
  );
};

export default RoleList;
