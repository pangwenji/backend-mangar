import React, { useCallback, useEffect, useState } from 'react';

import MyPageContainer from '@/components/MyPageContainer';
import SettingCardWrapper from '@/components/SettingCardWrapper';
import { queryRiskSettings, updateRiskSettings } from '@/services/api';
import type { API } from '@/services/typings';
import { useAccess } from '@umijs/max';
import { Card, message } from 'antd';
import RiskSettingGroup from './components/RiskSettingGroup';

const RiskSettings: React.FC = () => {
  const access = useAccess();
  const [settingsData, setSettingsData] = useState<API.RiskSettings>();

  const refreshData = useCallback(() => {
    queryRiskSettings()
      .then(setSettingsData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (access.RISK_MANAGEMENT_CONFIG_01) {
      refreshData();
    }
  }, [access.RISK_MANAGEMENT_CONFIG_01]);

  /** 编辑窗口的弹窗 */
  const handleOnChange = useCallback(
    async (data: Partial<API.RiskSettingsEdit>) => {
      if (!settingsData) return;
      try {
        await updateRiskSettings({
          ...settingsData,
          ...data,
        });
        refreshData();
        message.success('更新风控配置成功');
        return true;
      } catch {
        message.success('更新风控配置失败');
      }
    },
    [settingsData, refreshData]
  );
  const diabled = !access.RISK_MANAGEMENT_CONFIG_02;
  return (
    <MyPageContainer>
      {access.RISK_MANAGEMENT_CONFIG_01 && (
        <SettingCardWrapper loading={!settingsData}>
          {settingsData && (
            <>
              <Card title='会员' bordered={false}>
                <RiskSettingGroup
                  disabled={diabled}
                  settingsData={settingsData}
                  onChange={handleOnChange}
                  settings={[
                    {
                      label: '会员盈利预警',
                      note: '会员盈利金额大于等于X预警',
                      isMoney: true,
                      switchPropName: 'profitWarning',
                      numberPropName: 'profitAmount',
                    },
                    {
                      label: '会员对赌预警',
                      note: '会员对赌有效投注金额大于等于X预警',
                      isMoney: true,
                      switchPropName: 'bettingWarning',
                      numberPropName: 'bettingAmount',
                    },
                  ]}
                />
              </Card>
              <Card title='游戏' bordered={false}>
                <RiskSettingGroup
                  disabled={diabled}
                  settingsData={settingsData}
                  onChange={handleOnChange}
                  settings={[
                    {
                      label: '游戏亏损预警',
                      note: '游戏亏损金额大于等于X预警',
                      isMoney: true,
                      switchPropName: 'gameLossWarning',
                      numberPropName: 'gameLossAmount',
                    },
                  ]}
                />
              </Card>
              <Card title='IP地址' bordered={false}>
                <RiskSettingGroup
                  disabled={diabled}
                  settingsData={settingsData}
                  onChange={handleOnChange}
                  settings={[
                    {
                      label: '注册预警',
                      note: '同一IP注册会员数量大于等于X预警',
                      isMoney: false,
                      switchPropName: 'registerWarning',
                      numberPropName: 'registerWarningNumber',
                    },
                    {
                      label: '登录预警',
                      note: '同一IP登录会员数量大于等于X预警',
                      isMoney: false,
                      switchPropName: 'loginWarning',
                      numberPropName: 'loginWarningNumber',
                    },
                  ]}
                />
              </Card>
            </>
          )}
        </SettingCardWrapper>
      )}
    </MyPageContainer>
  );
};

export default RiskSettings;
