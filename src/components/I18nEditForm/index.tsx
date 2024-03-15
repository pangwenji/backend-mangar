import AutoResetModalForm from '@/components/AutoResetModalForm';
import TrimmedInput from '@/components/TrimmedInput';
import React, { useCallback, useState } from 'react';

import { translateZH } from '@/services/api';
import { API } from '@/services/typings';
import { i18nCompareFN, I18nMainLangCode } from '@/utils/commonHooks/i18n';
import type { ModalFormProps } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { useModel, useRequest } from '@umijs/max';
import { Button } from 'antd';
import { Rule } from 'antd/es/form';
import { useForm } from 'antd/es/form/Form';

const btnClass = css`
  line-height: 0;
  height: 100%;
  padding-inline: 8px;
`;

// zh 放到前面
const compareFN = i18nCompareFN;

const I18nEditForm: React.FC<ModalFormProps<API.I18nItem>> = (props) => {
  const { initialValues, ...restProps } = props;
  const { initialState } = useModel('@@initialState');
  const isEdit = !!initialValues;
  const title = isEdit ? '编辑语言' : '新增语言';
  const langs = initialState?.platformCache?.lang || [];
  const [form] = useForm();
  const { run, loading } = useRequest(translateZH, { manual: true });
  const [lastI18nItem, setLastI18nItem] = useState(initialValues);
  const [needTranslate, setNeedTranslate] = useState(false);

  const translateHandler = useCallback(async () => {
    const fields = form.getFieldsValue() as API.I18nItem;
    const zhCN = fields[I18nMainLangCode];
    if (zhCN) {
      try {
        const newI18n = await run(zhCN);
        form.setFieldsValue(newI18n);
        setLastI18nItem(newI18n);
      } catch {
      } finally {
        setNeedTranslate(false);
      }
    } else {
      form.validateFields([I18nMainLangCode]);
    }
  }, [form, run]);

  const LangCodeInput: React.FC<{
    code: string;
    value?: string;
    loading: boolean;
    translating: boolean;
  }> = useCallback(
    ({ code, loading, translating }) => {
      const isEdittedMain = isEdit && code === I18nMainLangCode;
      const isNotMain = isEdit && !(code === I18nMainLangCode);
      return (
        <TrimmedInput
          name={code}
          label={code}
          disabled={loading || (isNotMain && translating)}
          rules={
            [
              { required: true },
              isEdittedMain &&
                ({
                  validator(_, value) {
                    if (value !== lastI18nItem?.[I18nMainLangCode]) {
                      setNeedTranslate(true);
                      return Promise.reject(
                        new Error('中文更新后，请先点击一键翻译后，再确定编辑')
                      );
                    }
                    return Promise.resolve();
                  },
                } as Rule),
            ].filter(Boolean) as Rule[]
          }
          fieldProps={{
            suffix: isEdittedMain && (
              <Button
                onClick={translateHandler}
                type='primary'
                loading={loading}
                className={btnClass}
              >
                一键翻译
              </Button>
            ),
          }}
        />
      );
    },
    [isEdit, lastI18nItem, loading, translateHandler]
  );

  return (
    <AutoResetModalForm
      title={title}
      width='55%'
      initialValues={initialValues}
      form={form}
      {...restProps}
      loading={loading}
    >
      {!initialValues ? (
        <TrimmedInput
          name='str'
          label='翻译文本'
          rules={[{ required: true }]}
        />
      ) : (
        langs
          .sort((aReocrd, bRecord) => {
            return compareFN(aReocrd.code, bRecord.code);
          })
          .map(({ code }) => (
            <LangCodeInput
              key={code}
              code={code}
              loading={loading}
              translating={needTranslate}
            />
          ))
      )}
    </AutoResetModalForm>
  );
};

export default I18nEditForm;
