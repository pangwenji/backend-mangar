import { ProCard } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { isEqual, omit } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAccess } from '@umijs/max';
import { handleMenuAdd, handleMenuRemove, handleMenuUpdate } from './actions';
import EditMenuForm from './components/EditMenuForm';

import MenuTree, { MyTreeProps, MyTreeRef } from '@/components/MenuTree';
import MyModalWrapper from '@/components/MyModalWrapper';
import MyPageContainer from '@/components/MyPageContainer';
import { queryMenuList } from '@/services/api';
import type { API } from '@/services/typings';
import type { Key } from '@ant-design/pro-components';
import { useForm } from 'antd/es/form/Form';
import useToken from 'antd/es/theme/useToken';

const TabKeys = {
  Create: 'create-item',
  Edit: 'edit-item',
};

const MenuTable: React.FC = () => {
  const access = useAccess();
  const token = useToken()[1];
  const [menuList, setMenuList] = useState<API.MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<API.MenuItem>();
  const [selectedParentMenu, setSelectedParentMenu] = useState<API.MenuItem>();
  const [activeTab, setActiveTab] = useState(TabKeys.Create);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const treeRef = useRef<MyTreeRef>(null);
  const [createForm] = useForm();

  const initTreeList = useCallback(() => {
    return queryMenuList()
      .then(({ list }) => {
        setMenuList(list);
      })
      .catch(() => {
        // message.error('初始数据获取出错，请重新刷新页面');
      });
  }, []);

  const reloadAll = useCallback(() => {
    if (treeRef.current) {
      treeRef.current.reload();
      initTreeList();
    }
  }, [initTreeList, treeRef.current]);

  useEffect(() => {
    initTreeList();
  }, [initTreeList]);

  const initSelectState = () => {
    setSelectedMenu(undefined);
    setSelectedParentMenu(undefined);
    setSelectedKeys([]);
    setActiveTab(TabKeys.Create);
  };

  /** 编辑 */
  const onEditFormFinish = async (value: API.MenuEditItem) => {
    // console.log(value);
    const newMenuInfo = omit(value, [
      'parentName',
      'parentCode',
    ]) as API.MenuEditItem;

    const authRuleInfo = {
      ...selectedMenu,
      ...newMenuInfo,
    } as API.MenuItem;
    let success;
    // update
    if (activeTab === TabKeys.Edit) {
      const isChanged = !isEqual(authRuleInfo, selectedMenu);
      if (isChanged) {
        success = await handleMenuUpdate({
          ...newMenuInfo,
          parentId: selectedParentMenu?.id || null,
          id: selectedMenu!.id,
        });
      } else {
        // 没有变动无需刷新, 无需请求修改
        message.info('当前规则信息无任何改动');
        success = false;
      }
    } else {
      // create
      success = await handleMenuAdd({
        ...newMenuInfo,
        parentId: selectedMenu?.id || null,
      });
      createForm?.resetFields();
    }
    // 成功后都需要关闭编辑窗口, 刷新数据
    if (success) {
      initSelectState();
      reloadAll();
    }
  };

  const onSelect: MyTreeProps['onSelect'] = (selectedKeyArr, info) => {
    setSelectedKeys(selectedKeyArr);
    if (info.selected) {
      const currentMenu = info.node;
      setSelectedMenu(currentMenu);
      if (currentMenu) {
        const parentMenu = menuList.find(
          (menu) => menu.id === currentMenu.parentId
        );
        setSelectedParentMenu(parentMenu || undefined);
      }
    } else {
      initSelectState();
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <ProCard gutter={[8, 8]} ghost>
        <ProCard
          bordered
          colSpan='400px'
          style={{ maxHeight: 560, overflow: 'auto' }}
        >
          <MenuTree
            blockNode
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            ref={treeRef}
            reload={reloadAll}
          />
        </ProCard>
        <ProCard
          bordered
          // colSpan={{xs: 24}}
          style={{ minWidth: 480 }}
          tabs={{
            type: 'card',
            activeKey: activeTab,
            onChange: setActiveTab,
            items: [
              {
                label: '创建',
                key: TabKeys.Create,
                children: (
                  <EditMenuForm
                    onFinish={onEditFormFinish}
                    key={selectedMenu?.id}
                    parentMenu={selectedMenu}
                    form={createForm}
                    disabled={!access.SYSTEM_MANAGEMENT_MENU_01}
                  />
                ),
              },
              {
                label: '编辑',
                key: TabKeys.Edit,
                disabled: !selectedMenu,
                children: (
                  <EditMenuForm
                    onFinish={onEditFormFinish}
                    initialValues={selectedMenu}
                    key={selectedMenu?.id}
                    parentMenu={selectedParentMenu}
                    disabled={!access.SYSTEM_MANAGEMENT_MENU_02}
                    submitter={{
                      render: (_, doms) => {
                        return [
                          ...doms,
                          selectedMenu && (
                            <MyModalWrapper
                              key='delete'
                              content={
                                <>
                                  确定要
                                  <span style={{ color: token.colorError }}>
                                    删除
                                  </span>
                                  当前规则吗
                                </>
                              }
                              onFinish={async () => {
                                if (await handleMenuRemove(selectedMenu)) {
                                  reloadAll();
                                  initSelectState();
                                  return true;
                                }
                              }}
                            >
                              <Button
                                disabled={!access.SYSTEM_MANAGEMENT_MENU_03}
                                danger
                                key='delete'
                              >
                                删除
                              </Button>
                            </MyModalWrapper>
                          ),
                        ];
                      },
                    }}
                  />
                ),
              },
            ],
          }}
        ></ProCard>
      </ProCard>
      {/* <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setSelectedMenu(undefined);

          setShowDetail(false);
        }}
        closable={false}
      >
        {selectedMenu?.name && (
          <ProDescriptions<API.MenuItem>
            column={2}
            title={selectedMenu?.name}
            dataSource={selectedMenu}
            columns={columns as ProDescriptionsItemProps<API.MenuItem>[]}
          />
        )}
      </Drawer> */}
    </>
  );
};

const MenuList: React.FC = () => {
  return (
    <MyPageContainer>
      <MenuTable />
    </MyPageContainer>
  );
};

export default MenuList;
