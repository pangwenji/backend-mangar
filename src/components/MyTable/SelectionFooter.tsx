import { FooterToolbar } from '@ant-design/pro-components';
import { FooterToolbarProps } from '@ant-design/pro-layout/es/components/FooterToolbar';
import { Button } from 'antd';
import React, { memo } from 'react';
import MyPopconfirm from '../MyPopconfirm';

const SelectionFooter: React.FC<
  FooterToolbarProps & {
    selectedRows: any[];
    onDelete?: (selectedRows: any[]) => void;
  }
> = ({ selectedRows = [], children, onDelete, ...props }) => {
  return (
    !!selectedRows?.length && (
      <FooterToolbar
        extra={
          <div>
            已选择
            <a
              style={{
                fontWeight: 600,
              }}
            >
              &nbsp;{selectedRows.length}&nbsp;
            </a>
            项 &nbsp;&nbsp;
          </div>
        }
        {...props}
      >
        {children
          ? children
          : onDelete && (
              <MyPopconfirm
                key='delete'
                title='确定要删除所选数据吗'
                onConfirm={() => {
                  onDelete(selectedRows);
                }}
                okText='确定删除'
                cancelText='取消'
              >
                <Button>批量删除</Button>
              </MyPopconfirm>
            )}
      </FooterToolbar>
    )
  );
};
export default memo(SelectionFooter);
