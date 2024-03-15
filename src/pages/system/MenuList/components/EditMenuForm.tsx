import TrimmedInput from '@/components/TrimmedInput';
import React, { useEffect } from 'react';

import MySortInput from '@/components/MySortInput';
import NumValueSelect from '@/components/NumValueSelect';
import { MenuType, MenuTypeEnums } from '@/services/enums';
import type { API } from '@/services/typings';
import { ProForm, ProFormProps } from '@ant-design/pro-components';
import { omit } from 'lodash';

const DefultMenuType = MenuType.Catalog;
const NotCatalogEnums = omit(MenuTypeEnums, MenuType.Catalog);

const EditMenuForm: React.FC<
  ProFormProps<API.MenuItem> & { parentMenu?: API.MenuItem }
> = ({ parentMenu, ...props }) => {
  const { initialValues, form, ...restProps } = props;
  const isCatalog =
    initialValues?.menuType === MenuType.Catalog ||
    (!parentMenu && !initialValues);

  // 同步父级信息
  useEffect(() => {
    if (parentMenu) {
      form?.setFieldValue('parentName', parentMenu.name);
      form?.setFieldValue('parentCode', parentMenu.code);
    }

    form?.setFieldValue('menuType', isCatalog ? DefultMenuType : undefined);
  }, [form, parentMenu, isCatalog]);

  return (
    <ProForm
      layout='horizontal'
      initialValues={initialValues}
      form={form}
      labelCol={{ span: 3 }}
      labelAlign='left'
      {...restProps}
    >
      {/* 存在上级 */}
      {!!parentMenu && (
        <>
          <TrimmedInput
            name='parentName'
            label='上级名称'
            disabled
            initialValue={parentMenu.name}
          />
          <TrimmedInput
            name='parentCode'
            label='上级编码'
            disabled
            initialValue={parentMenu.code}
          />
        </>
      )}
      <TrimmedInput name='name' label='名称' rules={[{ required: true }]} />
      <TrimmedInput name='code' label='编码' rules={[{ required: true }]} />
      <TrimmedInput name='url' label='URL' rules={[{ required: true }]} />
      <NumValueSelect
        name='menuType'
        label='类型'
        valueEnum={isCatalog ? MenuTypeEnums : NotCatalogEnums}
        rules={[{ required: true }]}
        disabled={isCatalog || props.disabled}
      />
      {/* <TrimmedInput name='icon' label='图标' /> */}
      <MySortInput initialValue={initialValues ? undefined : 0} />
    </ProForm>
  );
};

export default EditMenuForm;
