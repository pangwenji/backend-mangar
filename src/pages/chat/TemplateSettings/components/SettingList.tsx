import { useAccess } from '@umijs/max';
import React, { memo, useRef, useState } from 'react';
import EditChatTemplateForm from './EditChatTemplateForm';

import { queryChatTemplateList } from '@/services/api';
import { handleChatTemplateUpdate } from '../actions';

import MyTable from '@/components/MyTable';
import type { API } from '@/services/typings';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';

const TemplateList: React.FC<{ lotteryCode: string }> = ({
  lotteryCode: gameCode,
}) => {
  const access = useAccess();
  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ChatTemplate>();

  /** 编辑窗口的弹窗 */
  const [onlyPreview, setOnlyPreview] = useState(false);
  const [editFormVisible, handleEditFormVisible] = useState<boolean>(false);
  const onEditFormCancel = () => {
    handleEditFormVisible(false);
    setOnlyPreview(false);
    if (currentRow) {
      setCurrentRow(undefined);
    }
  };
  const onEditFormFinish = async (quotaInfo: API.ChatTemplateEdit) => {
    let success;
    // update
    if (currentRow) {
      // 编辑模板信息
      success = await handleChatTemplateUpdate(quotaInfo, currentRow);
      // 修改当前模板, 需重置全局模板数据
    }
    // 成功后都需要关闭编辑窗口, 刷新数据
    if (success) {
      onEditFormCancel();
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const columns: ProColumns<API.ChatTemplate>[] = (
    [
      { title: 'ID', dataIndex: 'id', width: 100 },
      {
        title: '玩法名称',
        dataIndex: 'templateType',
        width: 'auto',
        // fixed: 'left',
        // width: 140,
        // render: (dom, entity) => {
        //   return (
        //     <a
        //       onClick={() => {
        //         setCurrentRow(entity);
        //         setShowDetail(true);
        //       }}
        //     >
        //       {dom}
        //     </a>
        //   );
        // },
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        fixed: 'right',
        width: 120,
        render: (_, record) => {
          return [
            <Button
              key='config'
              onClick={() => {
                handleEditFormVisible(true);
                setCurrentRow(record);
              }}
              type='link'
              disabled={!access.CHAT_MANAGEMENT_TEMPLATE_02}
            >
              编辑
            </Button>,
            <Button
              key='preview'
              onClick={() => {
                handleEditFormVisible(true);
                setOnlyPreview(true);
                setCurrentRow(record);
              }}
              type='text'
            >
              预览
            </Button>,
          ].filter(Boolean);
        },
      },
    ] as ProColumns<API.ChatTemplate>[]
  ).map((col) => {
    return {
      ellipsis: true,
      hideInSearch: true,
      ...col,
    };
  });
  return (
    access.CHAT_MANAGEMENT_TEMPLATE_01 && (
      <>
        <MyTable<API.ChatTemplate, any>
          actionRef={actionRef}
          params={{
            gameCode,
          }}
          search={false}
          scroll={{ x: 900 }}
          request={async (params) => {
            if (!params.gameCode) {
              return {
                success: true,
              };
            }
            return queryChatTemplateList(params);
          }}
          columns={columns}
          pagination={false}
        />
        <EditChatTemplateForm
          key={currentRow?.id}
          open={editFormVisible}
          onFinish={onEditFormFinish}
          modalProps={{ onCancel: onEditFormCancel }}
          onlyPreview={onlyPreview}
          initialValues={currentRow}
        />
      </>
    )
  );
};
export default memo(TemplateList);
