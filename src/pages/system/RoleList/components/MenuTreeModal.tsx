import AutoResetModalForm from '@/components/AutoResetModalForm';
import MenuTree from '@/components/MenuTree';
import { queryRoleMenuTree } from '@/services/api';
import { API } from '@/services/typings';
import { ModalFormProps } from '@ant-design/pro-components';
import { Checkbox, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Key } from 'antd/es/table/interface';
import { isEqual } from 'lodash';
import React, { memo, useEffect, useState } from 'react';

const deduplicate = (list: Key[]) => {
  return [...new Set(list)];
};

const childParentMap = new Map<Key, Key | null>();
const childParentsMap = new Map<Key, Key[]>();
const parrentChildrenMap = new Map<Key, Key[]>();

const getChildKeys = (node?: API.RoleMenuItem): Key[] => {
  if (!node?.child) return [];
  return node.child
    .map((child) => {
      return [child.id, ...getChildKeys(child)] as Key[];
    })
    .flat();
};

const initCheckedKeys = (nodes?: API.RoleMenuItem[], all = false) => {
  if (nodes?.length) {
    return nodes
      .filter((node) => node.isChecked || all)
      .map((node): string[] => {
        // 全量处理时
        if (all) {
          childParentMap.set(node.id, node.parentId);
          parrentChildrenMap.set(node.id, getChildKeys(node));
        }

        return [node.id, ...initCheckedKeys(node.child, all)];
      })
      .flat();
  }
  return [];
};

const getParentKeys = (key: Key): Key[] => {
  const parentKey = childParentMap.get(key);
  if (!parentKey) return [];
  return [parentKey, ...getParentKeys(parentKey)].flat() as Key[];
};

const MenuTreeModal: React.FC<
  ModalFormProps & {
    onSave(checkedKeys: Key[]): Promise<void>;
    roleId?: number;
  }
> = ({ onSave, roleId, open, ...props }) => {
  const [treeData, setTreeData] = useState<API.RoleMenuItem[]>([]);
  const [allKeys, setAllKeys] = useState<Key[]>([]);
  const [allChecked, setAllChecked] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);

  // 初始化数据
  useEffect(() => {
    if (!roleId || !open) {
      setTreeData([]);
      setAllKeys([]);
      setAllChecked(false);
      setCheckedKeys([]);
      return;
    }
    setLoading(true);
    queryRoleMenuTree(roleId)
      .then((data) => {
        setTreeData(data);
        const allKeyList = initCheckedKeys(data, true).sort();
        const checkedKeyList = initCheckedKeys(data).sort();
        allKeyList.forEach((key) => {
          childParentsMap.set(key, getParentKeys(key));
        });
        // 初始化全选状态
        if (isEqual(allKeyList, checkedKeyList)) {
          setAllChecked(true);
        }
        setCheckedKeys(checkedKeyList);
        setAllKeys(allKeyList);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [roleId, open]);

  const onAllCheckedlChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    if (checked) {
      setCheckedKeys(allKeys);
    } else {
      setCheckedKeys([]);
    }
  };

  const handleOnOk = async () => {
    setLoading(true);
    try {
      await onSave(checkedKeys);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const advenceCheckedKeys = (keys: Key[]) => {
    const isAdd = keys.length > checkedKeys.length;
    let resultKeys = [...keys];
    if (isAdd) {
      const addKey = keys.find((key) => !checkedKeys.includes(key))!;
      const addChildKeys = parrentChildrenMap.get(addKey)!;
      const addParentKeys = childParentsMap.get(addKey) || [];
      resultKeys = deduplicate([...addParentKeys, ...keys, ...addChildKeys]);
    } else {
      const removeKey = checkedKeys.find((key) => !keys.includes(key))!;
      const removedChildKeys = parrentChildrenMap.get(removeKey) || [];

      const allParentKeys = childParentsMap
        .get(removeKey)!
        .sort((aKey, bKey) => {
          return Number(bKey) - Number(aKey);
        });
      const removedParentKeys: Key[] = [];
      allParentKeys.forEach((pKey) => {
        const restKeys = keys.filter((k) => !removedParentKeys.includes(k));
        const childrenKeys = parrentChildrenMap.get(pKey) || [];
        const needRemove = !childrenKeys.some((cKey) =>
          restKeys.includes(cKey)
        );
        if (needRemove) {
          removedParentKeys.push(pKey);
        }
      });

      resultKeys = keys.filter((key) => {
        return (
          key &&
          !removedChildKeys.includes(key) &&
          !removedParentKeys.includes(key)
        );
      });
    }

    return resultKeys;
  };
  return (
    <AutoResetModalForm
      title='关联资源'
      open={open}
      onFinish={handleOnOk}
      submitter={{ searchConfig: { submitText: '保存' } }}
      {...props}
    >
      {roleId && (
        <Space direction='vertical' style={{ flex: 1 }}>
          <Checkbox onChange={onAllCheckedlChange} checked={allChecked}>
            全选
          </Checkbox>
          <MenuTree
            hideReloadBtn
            defaultExpandAll
            disabled={loading}
            loading={loading && !treeData.length}
            treeData={treeData}
            checkedKeys={checkedKeys}
            checkable
            checkStrictly
            selectable={false}
            rootStyle={{ maxHeight: '50vh', overflow: 'auto' }}
            onCheck={(checked) => {
              const newCheckedKeys = Array.isArray(checked)
                ? checked
                : checked.checked;
              const advencedKeys = advenceCheckedKeys(newCheckedKeys);
              setCheckedKeys(advencedKeys);
              if (isEqual(allKeys, advencedKeys.sort())) {
                setAllChecked(true);
              } else {
                setAllChecked(false);
              }
            }}
          />
        </Space>
      )}
    </AutoResetModalForm>
  );
};

export default memo(MenuTreeModal);
