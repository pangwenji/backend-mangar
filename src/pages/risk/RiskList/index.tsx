import React, { useRef, useState } from 'react';

import { queryRiskList } from '@/services/api';

import MyPageContainer from '@/components/MyPageContainer';
import MyTable from '@/components/MyTable';
import type { TableListPagination } from '@/pages/typings';
import { RiskTypeEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import { createTimeCol } from '@/utils/tableCols';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';

const SearchColWL = ['warningType'];

const RiskList: React.FC = () => {
  const access = useAccess();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RiskItem>();

  const columns: ProColumns<API.RiskItem>[] = (
    [
      {
        title: 'ID',
        dataIndex: 'id',
        fixed: 'left',
        width: 120,
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
        title: '预警类型',
        dataIndex: 'warningType',
        width: 200,
        valueEnum: RiskTypeEnums,
      },
      createTimeCol({ title: '预警时间', dataIndex: 'createTime', width: 220 }),
      {
        title: '预警配置',
        dataIndex: 'warningConfigContent',
        width: 300,
      },
      {
        title: '预警内容',
        dataIndex: 'content',
        width: 500,
      },
    ] as ProColumns<API.RiskItem>[]
  ).map((col) => {
    return {
      hideInSearch:
        !col.dataIndex || !SearchColWL.includes(col.dataIndex as string),
      ...col,
    };
  });

  return (
    <MyPageContainer>
      {access.RISK_MANAGEMENT_RECORD_01 && (
        <MyTable<API.RiskItem, TableListPagination>
          actionRef={actionRef}
          scroll={{ x: 1300 }}
          request={queryRiskList}
          columns={columns}
          rowSelection={false}
        />
      )}
      {/* <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.RiskItem>
            column={2}
            title={currentRow?.warningType}
            dataSource={currentRow}
            columns={columns as ProDescriptionsItemProps<API.RiskItem>[]}
          />
        )}
      </Drawer> */}
    </MyPageContainer>
  );
};

export default RiskList;
