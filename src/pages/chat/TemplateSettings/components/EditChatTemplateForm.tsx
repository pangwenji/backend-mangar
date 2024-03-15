import AutoResetModalForm from '@/components/AutoResetModalForm';
import { TrimmedTextArea } from '@/components/TrimmedInput';
import { previewChatTemplate } from '@/services/api';
import type { API } from '@/services/typings';
import { ProForm, type ModalFormProps } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Col, message, Space } from 'antd';
import useToken from 'antd/es/theme/useToken';
import React, { useEffect, useRef, useState } from 'react';

const PreviewClass = css`
  &.ant-input-disabled {
    overflow: auto;
    color: rgba(0, 0, 0, 0.8);
    white-space: pre-line;
    word-break: break-all;
    resize: none;
  }
`;
const EditableDivCalss = css`
  white-space: break-spaces;
  width: 100%;
  border-width: 2px;
  border-style: solid;
  border-color: #d9d9d9;
  outline: none;
  border-radius: 5px;
  min-height: 7em;
  display: inline-block;
  padding: 4px 11px;
  &:focus {
    border-color: #5acdfa;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(5, 222, 255, 0.06);
  }
`;

const getCaretCharOffset = (element: HTMLDivElement) => {
  var caretOffset = 0;

  if (window.getSelection) {
    const range = window.getSelection()?.getRangeAt(0);
    if (range) {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  }
  return caretOffset;
};

const setCaretCharOffset = (element: HTMLDivElement, offset: number) => {
  if (window.getSelection) {
    const range = document.createRange();
    const selection = window.getSelection();
    const childNodes = [...element.childNodes];
    const textLens = childNodes.map((node) => node.textContent?.length || 0);
    const nodeIndex = textLens.findIndex((_, index) => {
      const totalLength = textLens
        .slice(0, index + 1)
        .reduce((res, nextLen) => res + nextLen, 0);
      if (totalLength >= offset) {
        return true;
      }
      return false;
    });

    const nodeCaretOffset =
      offset -
      textLens.slice(0, nodeIndex).reduce((res, nextLen) => res + nextLen, 0);
    if (selection) {
      let targetChildNode = element.childNodes[nodeIndex];
      if (targetChildNode.nodeType !== 3) {
        targetChildNode = targetChildNode.childNodes[0];
      }
      // console.log('node  =. ', nodeIndex, nodeCaretOffset, targetChildNode);
      range.setStart(targetChildNode, nodeCaretOffset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      // selection.setPosition(targetChildNode, nodeCaretOffset);
    }
  }
  element.focus();
};

const splitStr = (str?: string) => str?.split(/\r?\n/) || [];

const formartContents = (str?: string) => {
  if (!str?.trim()) return '';
  const strArr = splitStr(str);
  if (strArr.length && !strArr[strArr.length - 1]) {
    strArr.pop();
  }
  if (strArr.length && !strArr[0]) {
    strArr.shift();
  }
  return strArr.join('\r\n');
};

const EditChatTemplateForm: React.FC<
  ModalFormProps<API.ChatTemplateEdit> & { onlyPreview?: boolean }
> = ({ initialValues, onFinish, onlyPreview = false, ...props }) => {
  const token = useToken()[1];
  const variables = (initialValues?.variables || []) as string[];
  const editorRef = useRef<HTMLDivElement>(null);
  const [lastContents, setLastContents] = useState<string>(
    initialValues?.contents
  );
  const [currentContents, setCurrentContents] = useState<string>(
    initialValues?.contents
  );
  const [previewContents, setPreviewContents] = useState<string>(
    initialValues?.previewContents
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues?.contents) {
      setCurrentContents(initialValues?.contents);
      setPreviewContents(initialValues?.previewContents);
    }
  }, [initialValues?.contents, initialValues?.previewContents]);

  const handleRefreshPreview = async () => {
    const text = editorRef.current?.innerText;
    // 不包含变量无需更新预览，直接本地处理
    const newTemplateContents = formartContents(text);
    if (!text || !variables.some((variable) => text.includes(variable))) {
      setPreviewContents(text || '');
      // 记录本次正确预览的模板内容
      setLastContents(newTemplateContents);
    } else {
      // 两次模板内容相同无需更新预览
      if (newTemplateContents === lastContents) return;
      setLoading(true);
      const hide = message.loading('更新预览中...');
      try {
        const newPreviewContents = await previewChatTemplate({
          id: initialValues!.id,
          contents: newTemplateContents,
        });
        // 记录本次正确预览的模板内容
        setLastContents(newTemplateContents);
        setPreviewContents(newPreviewContents);
        message.success('更新预览成功');
      } catch {
        // message.error('更新预览失败');
      } finally {
        setLoading(false);
        hide();
      }
    }
  };

  const hightlight = (contents: string, variables: string[]) => {
    variables.forEach((variable) => {
      contents = contents.replaceAll(
        variable,
        `<span style="color:${token.colorError};">${variable}</span>`
      );
    });
    return contents;
  };

  const handleOnInput: React.DOMAttributes<HTMLDivElement>['onInput'] = () => {
    if (!editorRef.current) return;
    const innerText = editorRef.current.innerText;
    // 记录输入 caret
    const caretOffset = getCaretCharOffset(editorRef.current);
    // 高亮内容
    const newContents = hightlight(innerText, variables);
    editorRef.current.innerHTML = newContents;
    // 设置记录的 caret
    setCaretCharOffset(editorRef.current, caretOffset);
  };

  const [editorError, setEditorError] = useState<string>();

  return (
    <AutoResetModalForm
      title={onlyPreview ? '预览' : '编辑模板'}
      width={630}
      labelCol={{ span: 2 }}
      loading={loading}
      colon
      onFinish={async () => {
        if (editorError) return Promise.resolve(false);
        return onFinish?.({
          id: initialValues!.id,
          contents: formartContents(editorRef.current?.innerText?.trim() || ''),
        });
      }}
      {...props}
      submitter={onlyPreview ? { render: false } : undefined}
    >
      {!onlyPreview && (
        <>
          <Col span={24}>
            <ProForm.Item label='变量' style={{ flex: 1 }}>
              <Space wrap style={{ color: token.colorError }}>
                {variables?.map((variable: string) => {
                  return <span key={variable}>{variable}</span>;
                })}
              </Space>
            </ProForm.Item>
          </Col>
          <Col span={24}>
            <ProForm.Item
              name='contents'
              label='模板'
              style={{ flex: 1 }}
              rules={
                [
                  /*  {
                  validateTrigger: ['onInput', 'onBlur'],
                  validator(_, _1, callback) {
                    const text = editorRef.current?.innerText;
                    setEditorError(undefined);
                    variables.forEach((variable) => {
                      if (!text?.includes(variable)) {
                        const errorMsg = `模板内容需要包含上述变量: ${variables}`;
                        setEditorError(errorMsg);
                        return Promise.reject(errorMsg);
                      }
                    });
                    return Promise.resolve();
                  },
                }, */
                ]
              }
            >
              {/* <Space direction='vertical' style={{ display: 'flex' }}> */}
              <div
                contentEditable
                dangerouslySetInnerHTML={{
                  __html: hightlight(currentContents, variables),
                }}
                style={{
                  ...(!!editorError && { borderColor: token.colorError }),
                }}
                className={EditableDivCalss}
                ref={editorRef}
                onInput={handleOnInput}
                onBlur={handleRefreshPreview}
              ></div>
              {/*  {editorError && (
                  <Alert
                    message={editorError}
                    type='error'
                    showIcon
                    afterClose={() => setEditorError(undefined)}
                    closable
                  />
                )} */}
              {/* </Space> */}
            </ProForm.Item>
          </Col>
        </>
      )}
      <TrimmedTextArea
        label={onlyPreview ? false : '预览'}
        fieldProps={{
          value: previewContents,
          rows: splitStr(previewContents).length || 1,
          className: PreviewClass,
        }}
        disabled
      ></TrimmedTextArea>
    </AutoResetModalForm>
  );
};

export default EditChatTemplateForm;
