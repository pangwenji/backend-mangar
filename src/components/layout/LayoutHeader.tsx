import { CustomCommonBG } from '@/../config/theme';
import { getOnlineUserInfo } from '@/services/api';
import { API } from '@/services/typings';
import { IS_DEV_ENV } from '@/utils/consts';
import { useAccess } from '@umijs/max';
import { Badge, Space } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { AvatarDropdown } from './AvatarDropdown';
import MessageAlert from './MessageAlert';

const Polling = 10000; // 10s

const LayoutHeader: React.FC = (props: any) => {
  const access = useAccess();
  const [onlineUserInfo, setOnlineUserInfo] = useState<API.OnlineUserInfo>();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const startPolling = () => {
      getOnlineUserInfo()
        .then((info) => {
          setOnlineUserInfo(info.data);
        })
        .catch(() => {})
        .finally(() => {
          // 开发环境关闭轮询，方便其他接口调试
          if (IS_DEV_ENV) return;
          timer = setTimeout(() => {
            startPolling();
          }, Polling);
        });
    };

    startPolling();
    return () => {
      timer && clearTimeout(timer);
    };
  }, []);

  return (
    <div className='layout-inner-header' style={{ background: CustomCommonBG }}>
      <Space size={32} align='center'>
        <Badge
          status='processing'
          text={`在线管理: ${
            onlineUserInfo ? onlineUserInfo.mgtUserNum : '暂无数据'
          }`}
        />
        <Badge
          status='success'
          text={`在线会员: ${
            onlineUserInfo ? onlineUserInfo.playerNum : '暂无数据'
          }`}
        />
      </Space>
      <Space size={23} align='center'>
        {access.RISK_MANAGEMENT_RECORD && access.RISK_MANAGEMENT_RECORD_01 && (
          <MessageAlert />
        )}
        <AvatarDropdown />
      </Space>
    </div>
  );
};
export default memo(LayoutHeader);
