import { queryMenuTree } from '@/services/api';
import { API } from '@/services/typings';
import { Button, Empty, Space, Spin, Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

const treeFieldNames = { title: 'name', key: 'id', children: 'child' };

export type MyTreeProps = TreeProps<API.MenuItem> & {
  reload?(): Promise<void> | void;
  loading?: boolean;
  hideReloadBtn?: boolean;
};

export type MyTreeRef = { reload(): Promise<void> };

const MenuTree = forwardRef<MyTreeRef, MyTreeProps>(
  ({ hideReloadBtn, treeData, reload, ...props }, ref) => {
    const [loading, setLoading] = useState(!treeData);
    const [menuTreeData, setMenuTreeData] = useState<API.MenuItem[]>(
      treeData || []
    );
    const treeReload = useCallback(() => {
      setLoading(true);
      return queryMenuTree()
        .then(setMenuTreeData)
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }, []);

    useImperativeHandle(
      ref,
      () => {
        return {
          reload: treeReload,
        };
      },
      [treeReload]
    );

    // 默认数据获取全部
    useEffect(() => {
      if (!treeData) {
        treeReload();
      } else {
        setMenuTreeData(treeData);
        setLoading(false);
      }
    }, [treeReload, treeData]);

    return loading || props.loading ? (
      <Spin size='large' style={{ width: '100%' }} />
    ) : menuTreeData.length ? (
      <Tree<API.MenuItem>
        fieldNames={treeFieldNames}
        {...props}
        treeData={menuTreeData}
      />
    ) : (
      !hideReloadBtn && (
        <Space direction='vertical' align='center' style={{ width: '100%' }}>
          <Empty />
          <Button onClick={reload || treeReload}>重试</Button>
        </Space>
      )
    );
  }
);
export default memo(MenuTree);
