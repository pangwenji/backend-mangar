import { AppRoutePath } from '@/../config/routes';
import bellIcon from '@/statics/imgs/messageAlert.png';
import { history } from '@umijs/max';
import { Button, Card, Dropdown, List, MenuProps } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import React, { memo, useState } from 'react';

const tabListNoTitle = [
  {
    key: 'riskAlert',
    label: '预警',
  },
  {
    key: 'app',
    label: '通知',
  },
  {
    key: 'project',
    label: '通知',
  },
];

const data = [
  {
    title: '假数据 1',
  },
  {
    title: '假数据 2',
  },
  {
    title: '假数据 3',
  },
  {
    title: '假数据 4',
  },
];

const contentListNoTitle: Record<string, React.ReactNode> = {
  riskAlert: (
    <List
      itemLayout='horizontal'
      dataSource={data}
      split={false}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta title={item.title} description='6分钟' />
        </List.Item>
      )}
    />
  ),
  app: <p>app content</p>,
  project: <p>project content</p>,
};

const AlertContent: React.FC = () => {
  const [activeTabKey2, setActiveTabKey2] = useState<string>('riskAlert');
  const onTab2Change = (key: string) => {
    setActiveTabKey2(key);
  };
  return (
    <Card
      bordered={false}
      style={{ width: '100%' }}
      tabProps={{ centered: true }}
      tabList={tabListNoTitle}
      activeTabKey={activeTabKey2}
      onTabChange={onTab2Change}
      actions={[<span>查看全部</span>]}
    >
      {contentListNoTitle[activeTabKey2]}
    </Card>
  );
};

const items: MenuProps['items'] = [
  {
    key: 'risk',
    label: '预警信息',
  },
];

const onMenuClick = (event: MenuInfo) => {
  const { key } = event;
  switch (key) {
    case 'risk':
      history.push(AppRoutePath.RiskList);
      return;
    default:
      return;
  }
};

const MessageAlert: React.FC = () => {
  return (
    <Dropdown
      overlayStyle={{ top: 63 }}
      menu={{ items, onClick: onMenuClick }}
      placement='bottom'
    >
      <Button className='message-alert' type='primary' shape='round'>
        <img src={bellIcon} />
      </Button>
    </Dropdown>
  );
};

// const MessageAlert: React.FC = (props: any) => {
//   const theme = useToken()[1];
//   return (
//     <ConfigProvider
//       theme={{
//         components: {
//           Tabs: {
//             itemColor: theme.colorText,
//             itemActiveColor: theme.colorPrimary,
//             itemSelectedColor: theme.colorPrimary,
//             lineHeight: 1,
//             horizontalItemPaddingLG: '15px 0',
//           },
//           Card: {
//             headerHeight: 44,
//             headerBg: 'transparent',
//           },
//           List: {
//             itemPadding: '8px 0',
//             descriptionFontSize: 12,
//             lineHeight: 1,
//           },
//         },
//       }}
//     >
//       <Popover
//         placement='bottomLeft'
//         overlayClassName='message-alert-overlay'
//         content={<AlertContent />}
//         trigger='click'
//       >
//         {/* <Badge dot offset={[-3, 3]}> */}
//         <Button className='message-alert' type='primary' shape='round'>
//           <img src={bellIcon} />
//           {/* <span>12</span> */}
//         </Button>
//         {/* </Badge> */}
//       </Popover>
//     </ConfigProvider>
//   );
// };
export default memo(MessageAlert);
