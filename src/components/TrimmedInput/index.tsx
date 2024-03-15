import { ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import React from 'react';

import type { ProFormItemProps } from '@ant-design/pro-form/es/components';
import type {
  ExtendsProps,
  FieldProps,
  LightFilterFooterRender,
  ProFormFieldItemProps,
  ProFormGridConfig,
} from '@ant-design/pro-form/es/typing';
import type { ProFieldProps } from '@ant-design/pro-utils';
import type { InputProps, InputRef, PasswordProps } from 'antd/lib/input';
import type { TextAreaProps, TextAreaRef } from 'antd/lib/input/TextArea';
import { Rule } from 'antd/es/form';

type FormPWD = React.FC<ProFormFieldItemProps<PasswordProps , InputRef> & {
  closeDefaultRules?: boolean
}>;

export type TrimmedInputProps = ProFormFieldItemProps<InputProps, InputRef>;
export type FormText = React.FC<TrimmedInputProps> & {
  Password: FormPWD;
};

const TrimmedInput: FormText = (props) => {
  const form = useFormInstance();
  const { fieldProps = {}, name } = props;
  const { onBlur } = fieldProps;
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (name) {
      const value = form.getFieldValue(name);
      if (typeof value === 'string') {
        form.setFieldsValue({ [name as string]: value.trim() });
      } else if (Array.isArray(value)) {
        form.setFieldsValue({
          [name as string]: value.map((item) => {
            return typeof item === 'string' ? item.trim() : item;
          }),
        });
      }
    }

    onBlur?.(e);
  };

  return (
    <ProFormText
      {...props}
      name={name}
      fieldProps={{
        ...fieldProps,
        onBlur: handleBlur,
      }}
    />
  );
};

const PWDReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;

const Password: FormPWD = ({ rules = [], closeDefaultRules = false, ...props }) => {
  const form = useFormInstance();
  const { fieldProps = {}, name } = props;
  const { onBlur } = fieldProps;

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (name) {
      const value = form.getFieldValue(name);
      if (value) {
        form.setFieldsValue({ [name as string]: value.trim() });
      }
    }

    onBlur?.(e);
  };

  return (
    <ProFormText.Password
      {...props}
      name={name}
      rules={[
        ...rules,
        !closeDefaultRules && {
          validator(_, value) {
            if (!value || PWDReg.test(value)) {
              return Promise.resolve();
            } else {
              return Promise.reject(
                new Error('必须包含大小写字母和数字，长度8-20')
              );
            }
          },
        } as Rule,
      ].filter(Boolean) as Rule[]}
      fieldProps={{
        ...fieldProps,
        onBlur: handleBlur,
      }}
    />
  );
};

TrimmedInput.Password = Password;

export default TrimmedInput;

type TextAreaType = React.FC<
  {
    fieldProps?: (FieldProps<TextAreaRef> & TextAreaProps) | undefined;
    placeholder?: string | string[] | undefined;
    secondary?: boolean | undefined;
    cacheForSwr?: boolean | undefined;
    disabled?: boolean | undefined;
    width?: number | 'sm' | 'md' | 'xl' | 'xs' | 'lg' | undefined;
    proFieldProps?: ProFieldProps | undefined;
    footerRender?: LightFilterFooterRender | undefined;
    children?: React.ReactNode;
  } & Omit<ProFormItemProps, 'valueType'> &
    Pick<ProFormGridConfig, 'colProps'> &
    ExtendsProps &
    React.RefAttributes<any>
>;

export const TrimmedTextArea: TextAreaType = (props) => {
  const form = useFormInstance();
  const { fieldProps = {}, name } = props;
  const { onBlur } = fieldProps;

  const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
    if (name) {
      const value = form.getFieldValue(name);
      if (value) {
        form.setFieldsValue({ [name as string]: value.trim() });
      }
    }
    onBlur?.(e);
  };

  return (
    <ProFormTextArea
      {...props}
      name={name}
      fieldProps={{
        ...fieldProps,
        onBlur: handleBlur,
      }}
    />
  );
};
