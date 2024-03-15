import { DarkTextColor } from '@/../config/theme';
import AutoResetModalForm from '@/components/AutoResetModalForm';
import ImageWithFallback from '@/components/ImageWithFallback';
import MyModalWrapper from '@/components/MyModalWrapper';
import { API } from '@/services/typings';
import {
  ModalFormProps,
  ProDescriptions,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Button, message, Space, Typography } from 'antd';
import React, { memo } from 'react';

type ExtraProps = Pick<API.AdminItem, 'googleKey' | 'googleUrl'>;
type GoogleModalProps = ExtraProps &
  ModalFormProps & {
    onReset?: () => Promise<boolean>;
  };

const borderColor = 'rgba(72, 71, 96, 0.28)';

const CaptchContainerClass = css`
  &.ant-descriptions {
    .ant-descriptions-item {
      padding-bottom: 22px;
    }
    .ant-descriptions-item-label {
      padding-right: 2em;
      color: ${DarkTextColor};
      &::after {
        content: none;
      }
    }
    .ant-descriptions-row:first-child {
      .ant-descriptions-item-container {
        align-items: center;
      }
    }
  }
`;

const CaptchaTxtClass = css`
  border: 1px ${borderColor} solid;
  border-radius: 6px;
  color: rgba(72, 71, 96, 0.5);
  background: rgba(72, 71, 96, 0.1);
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 8px;
  .text-content {
    flex: 1;
  }
  div[role='button'] {
    margin-left: 10px;
  }
`;

const CaptchaImgClass = css`
  .ant-image {
    padding: 10px;
    border: 1px solid ${borderColor};
    border-radius: 8px;
  }
`;

const downloadQRCode = (imgUrl: string) => {
  if (imgUrl) {
    const a = document.createElement('a');
    fetch(imgUrl)
      .then((res) => res.blob())
      .then((blob) => {
        // 将链接地址字符内容转变成blob地址
        a.href = URL.createObjectURL(blob);
        a.download = 'QRCode.png'; // 下载文件的名字
        document.body.appendChild(a);
        a.click();
        //在资源下载完成后 清除 占用的缓存资源
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      })
      .catch((err) => {
        message.error(err?.message || err);
      });
  }
};

const GoogleModal: React.FC<GoogleModalProps> = ({
  googleUrl,
  googleKey,
  onReset,
  ...props
}) => {
  return (
    <AutoResetModalForm
      width={460}
      {...props}
      style={{ width: 'fit-content' }}
      modalProps={{
        centered: true,
      }}
      title='Google授权码'
      submitter={{ submitButtonProps: { hidden: true } }}
    >
      <ProDescriptions<ExtraProps>
        column={1}
        dataSource={{ googleKey, googleUrl }}
        rootClassName={CaptchContainerClass}
        columns={
          [
            {
              dataIndex: 'googleKey',
              title: 'Google授权码',
              render(_, record) {
                return (
                  <Typography.Text
                    rootClassName={CaptchaTxtClass}
                    copyable={{
                      icon: '复制',
                      tooltips: false,
                      text: record.googleKey!,
                    }}
                    editable={{
                      editing: false,
                      tooltip: false,
                      icon: (
                        <MyModalWrapper
                          content='确认要重置当前用户的Google授权码吗'
                          onFinish={onReset}
                        >
                          <Button
                            style={{
                              padding: 0,
                              height: '1em',
                              lineHeight: '1em',
                            }}
                            type='text'
                          >
                            重置
                          </Button>
                        </MyModalWrapper>
                      ),
                    }}
                  >
                    <span className='text-content'>{record.googleKey!}</span>
                  </Typography.Text>
                );
              },
            },
            {
              dataIndex: 'googleUrl',
              title: 'Google二维码',
              render(_, record) {
                return (
                  <Space className={CaptchaImgClass} align='end'>
                    <ImageWithFallback
                      src={record.googleUrl!}
                      preview={false}
                      width={160}
                    />
                    <Button
                      type='link'
                      onClick={() => downloadQRCode(record.googleUrl!)}
                      style={{
                        paddingBlock: 0,
                        height: '1em',
                        lineHeight: '1em',
                      }}
                    >
                      下载
                    </Button>
                  </Space>
                );
              },
            },
          ] as ProDescriptionsItemProps<ExtraProps>[]
        }
      />
    </AutoResetModalForm>
  );
};
export default memo(GoogleModal);
