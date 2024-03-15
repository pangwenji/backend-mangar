import AutoResetModalForm from '@/components/AutoResetModalForm';
import { handleI18nUpdate } from '@/pages/system/I18nSettings/actions';
import { API } from '@/services/typings';
import { I18nMainLangCode, useMyI18n } from '@/utils/commonHooks/i18n';
import { EditOutlined } from '@ant-design/icons';
import type { ModalFormProps } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button, Form, message } from 'antd';
import { isEqual, omit } from 'lodash';
import React, { createElement, memo, PropsWithChildren, ReactPortal, useState } from 'react';
import I18nEditForm from '.';

const btnClass = css`
  line-height: 0;
  height: auto;
  padding-inline: 8px;
`;

export const I18nFieldWrapper: React.FC<PropsWithChildren<{ langID?: number }>> = memo(
  ({ children, langID }) => {
    const formInstance = Form.useFormInstance();
    const element = children as ReactPortal;
    const LangID = langID || formInstance.getFieldValue('lang_id');
    const { loading, i18nIDRun } = useMyI18n(LangID, {
      manual: true,
    });
    const [i18nEditItem, setI18nEditItem] = useState<API.I18nItem>();
    const filedName = LangID ? I18nMainLangCode : element.props.name;

    if (element.type && element.props.label) {
      const onFinish = async (value: API.I18nItem) => {
        const isChanged = !isEqual(omit(i18nEditItem, ['id', 'platform_id']), value);
        let success = false;
        if (isChanged) {
          const updateItem = {
            ...i18nEditItem,
            ...value,
          };
          success = await handleI18nUpdate(updateItem);
          formInstance.setFieldValue(I18nMainLangCode, updateItem[I18nMainLangCode]);
          if (success) {
            setI18nEditItem(undefined);
          }
        } else {
          success = true;
          message.info('当前语言信息无任何改动');
          // setI18nEditItem(undefined);
        }
      };

      const copy = createElement(
        element.type,
        {
          disabled: !!LangID,
          ...element.props,
          // 编辑模式，直接更新 zh_cn
          name: filedName,
          label: (
            <>
              {element.props.label}
              {LangID && (
                <Button
                  type="text"
                  className={btnClass}
                  onClick={async () => {
                    if (LangID) {
                      const i18nData = await i18nIDRun();
                      setI18nEditItem(i18nData);
                    }
                  }}
                  loading={loading}
                >
                  <EditOutlined />
                </Button>
              )}
            </>
          ),
        },
        ...[element.children].flat(),
      );
      return (
        <>
          {copy}
          {!!i18nEditItem && (
            <I18nEditForm
              open={!!i18nEditItem}
              initialValues={i18nEditItem}
              onFinish={onFinish}
              modalProps={{ onCancel: () => setI18nEditItem(undefined) }}
            />
          )}
        </>
      );
    } else {
      return <>{children}</>;
    }
  },
);

export const I18nFormWrapper: React.FC<ModalFormProps<any>> = memo(
  ({ children, onFinish, ...props }) => {
    return (
      <AutoResetModalForm
        {...props}
        onFinish={
          onFinish
            ? (values) => {
                return onFinish?.(omit(values, I18nMainLangCode));
              }
            : undefined
        }
      >
        {children}
      </AutoResetModalForm>
    );
  },
);
