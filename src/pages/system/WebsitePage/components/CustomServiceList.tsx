import { ProDescriptions } from '@ant-design/pro-components';
import { Button, Drawer, message, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import EditCustomServiceForm from './EditCustomServiceForm';

import { queryCustomServiceList } from '@/services/api';
import { useAccess } from '@umijs/max';
import { isEqual } from 'lodash';
import {
  handleCustomServiceSwitch,
  handleCustomServiceUpdate,
} from '../actions';

import MyModalWrapper from '@/components/MyModalWrapper';
import HighlightText from '@/components/MyModalWrapper/HighlightText';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import { SwitchStatus } from '@/services/enums';
import type { API } from '@/services/typings';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import useToken from 'antd/es/theme/useToken';

const CustomServiceList: React.FC = () => {
  const access = useAccess();
  const token = useToken()[1];
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CustomServiceItem>();

  /** 编辑窗口的弹窗 */
  const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
  const onEditFormFinish = async (value: API.CustomServiceEditItem) => {
    const websiteInfo = {
      ...currentRow,
      ...value,
    } as API.CustomServiceEditItem;

    let success;
    // update
    if (currentRow) {
      const isChanged = !isEqual(websiteInfo, currentRow);
      // 有变动
      if (isChanged) {
        success = await handleCustomServiceUpdate(value, currentRow);
      } else {
        success = true;
        message.info('当前信息无任何改动');
      }
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

  const columns: ProColumns<API.CustomServiceItem>[] = (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 150,
      },
      {
        title: '职位',
        dataIndex: 'position',
        width: 170,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 220,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 170,
      },
      {
        title: '账号',
        dataIndex: 'account',
      },
      access.SYSTEM_MANAGEMENT_WEBSITE_CS_SWTICH && {
        title: '启用',
        dataIndex: 'isValidity',
        valueType: 'option',
        fixed: 'right',
        width: 100,
        render(_, entity) {
          const isOpen = entity.isValidity === SwitchStatus.Open;
          const switchTxt = isOpen ? '关闭' : '开启';
          return (
            <MyModalWrapper
              onFinish={async () => {
                if (
                  await handleCustomServiceSwitch({
                    id: entity.id,
                    isValidity: Number(!isOpen),
                  })
                ) {
                  actionRef.current?.reload();
                  return true;
                } else {
                  return false;
                }
              }}
              content={
                <div>
                  确认要
                  <span
                    style={{
                      color: isOpen ? token.colorError : token.colorPrimary,
                    }}
                  >
                    {switchTxt}
                  </span>
                  客服
                  <br />
                  <HighlightText>
                    {entity.position}-{entity.name}
                  </HighlightText>
                  吗？
                </div>
              }
            >
              <Switch
                checkedChildren='开'
                unCheckedChildren='关'
                checked={isOpen}
                disabled={!access.SYSTEM_MANAGEMENT_WEBSITE_CS_SWTICH}
              />
            </MyModalWrapper>
          );
        },
      },
      access.SYSTEM_MANAGEMENT_WEBSITE_CS_UPDATE && {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        width: 80,
        render: (_, record) => (
          <Button
            key='config'
            onClick={() => {
              handleEditFormVisible(true);
              setCurrentRow(record);
            }}
            type='link'
            disabled={!access.SYSTEM_MANAGEMENT_WEBSITE_CS_UPDATE}
          >
            编辑
          </Button>
        ),
      },
    ] as ProColumns<API.CustomServiceItem>[]
  ).filter(Boolean);

  return (
    <>
      <MyTable<API.CustomServiceItem, TableListPagination>
        actionRef={actionRef}
        request={queryCustomServiceList}
        columns={columns}
        rowSelection={false}
        scroll={{ x: 1200 }}
        search={false}
        pagination={false}
      />
      <EditCustomServiceForm
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
        width={700}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.CustomServiceItem>
            column={2}
            title={currentRow?.name}
            dataSource={currentRow}
            columns={
              columns as ProDescriptionsItemProps<API.CustomServiceItem>[]
            }
          />
        )}
      </Drawer>
    </>
  );
};

export default CustomServiceList;
