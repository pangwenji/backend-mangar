import MyModalWrapper from '@/components/MyModalWrapper';
import HighlightText from '@/components/MyModalWrapper/HighlightText';
import { API } from '@/services/typings';
import { QuestionCircleFilled } from '@ant-design/icons';
import { InputNumber, Space, Switch, Tooltip, Typography } from 'antd';
import { valueType } from 'antd/es/statistic/utils';
import useToken from 'antd/es/theme/useToken';
import { InputNumberProps } from 'antd/lib';
import React, { memo, useEffect, useState } from 'react';
const { Text } = Typography;

interface ISetting {
  label: string;
  note: string;
  switchPropName: keyof API.RiskSettings;
  numberPropName: keyof API.RiskSettings;
  isMoney: boolean;
}

interface IRiskSettingGroupProps {
  settings: ISetting[];
  settingsData: API.RiskSettings;
  onChange(data: Partial<API.RiskSettingsEdit>): Promise<boolean | undefined>;
  disabled?: boolean;
}

const MoneyConfig: Pick<
  InputNumberProps,
  'formatter' | 'parser' | 'precision'
> = {
  formatter: (value) =>
    `${value || 0}`.replace(/(?<!\..*)\B(?=(\d{3})+(?!\d))/g, ','),
  parser: (value) => value?.replace(/\$\s?|(,*)/g, '') || 0,
  precision: 2,
};

const RiskSetting: React.FC<
  { setting: ISetting } & Omit<IRiskSettingGroupProps, 'settings'>
> = ({ setting, onChange, settingsData, disabled }) => {
  const [inputting, setInputting] = useState(false);
  const [value, setValue] = useState<valueType | null>(null);
  const token = useToken()[1];
  useEffect(() => {
    if (!inputting && value && settingsData[setting.numberPropName] !== value) {
      onChange({ [setting.numberPropName]: value });
    }
  }, [value, inputting, onChange, setting, settingsData]);
  const checked = settingsData[setting.switchPropName];
  return (
    <Space
      style={{ display: 'flex', width: 500 }}
      size={16}
      key={setting.switchPropName}
    >
      <MyModalWrapper
        content={
          <div>
            确认要
            <span
              style={{ color: checked ? token.colorError : token.colorPrimary }}
            >
              {checked ? '关闭' : '开启'}
            </span>
            <br />
            <HighlightText>{setting.label}?</HighlightText>
          </div>
        }
        onFinish={() => {
          return onChange({ [setting.switchPropName]: !checked });
        }}
      >
        <Switch
          checked={checked as boolean}
          checkedChildren='开'
          unCheckedChildren='关'
          disabled={disabled}
        />
      </MyModalWrapper>
      <Text style={{ minWidth: 104, display: 'inline-block' }}>
        {setting.label}
        <Tooltip title={setting.note}>
          <QuestionCircleFilled
            style={{ marginLeft: '0.25em', color: 'rgba(72, 71, 96, 0.5)' }}
          />
        </Tooltip>
      </Text>
      <InputNumber
        style={{ width: 150, backgroundColor: 'rgba(72, 71, 96, 0.1)' }}
        min={0}
        defaultValue={settingsData[setting.numberPropName] as number}
        {...(setting.isMoney ? MoneyConfig : { precision: 0 })}
        onFocus={() => {
          setInputting(true);
        }}
        onChange={(value) => {
          setValue(value);
        }}
        onBlur={() => {
          setInputting(false);
        }}
        disabled={disabled}
      />
    </Space>
  );
};

const RiskSettingGroup: React.FC<IRiskSettingGroupProps> = ({
  settingsData,
  settings,
  onChange,
  disabled,
}) => {
  return (
    <Space wrap>
      {settings.map((setting) => {
        return (
          <RiskSetting
            key={setting.label}
            setting={setting}
            onChange={onChange}
            settingsData={settingsData}
            disabled={disabled}
          />
        );
      })}
    </Space>
  );
};
export default memo(RiskSettingGroup);
