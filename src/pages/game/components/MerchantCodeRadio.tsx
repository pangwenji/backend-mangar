import { queryMerchantMenu } from '@/services/api';
import { API } from '@/services/typings';
import { Radio } from 'antd';
import React, { memo, useEffect, useState } from 'react';

const MerchantCodeRadio: React.FC<{ onChange: (menuID: number) => void }> = ({
  onChange,
}) => {
  const [merchantMenuData, setMerchantMenuData] = useState<API.MerchantInfo[]>(
    []
  );
  const [currentMerchantID, setCurrentMerchantID] = useState<number>();
  useEffect(() => {
    queryMerchantMenu()
      .then((menu) => {
        if (menu.length) {
          const currentMerchantID = menu[0].id;
          setCurrentMerchantID(currentMerchantID);
          setMerchantMenuData(menu);
          onChange(currentMerchantID);
        }
      })
      .catch(() => {});
    return () => {};
  }, [onChange]);

  return (
    <Radio.Group
      value={currentMerchantID}
      buttonStyle='solid'
      onChange={(ev) => {
        const merchantID = ev.target.value;
        setCurrentMerchantID(merchantID);
        onChange(merchantID);
      }}
    >
      {merchantMenuData.map((menu) => (
        <Radio.Button key={menu.id} value={menu.id}>
          {menu.merchantName}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
export default memo(MerchantCodeRadio);
