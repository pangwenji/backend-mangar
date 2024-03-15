import { DarkTextColor } from '@/../config/theme';
import AutoResetModalForm from '@/components/AutoResetModalForm';
import { queryRoleUserLists } from '@/services/api';
import { API } from '@/services/typings';
import { ModalFormProps } from '@ant-design/pro-components';
import { css } from '@emotion/css';
import { Spin, Transfer } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';

const TransferContainerClass = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: strectch;
  padding-inline: 20px;
  width: 580px;
  min-height: 475.08px;
  .ant-spin {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;

const TransferClass = css`
  justify-content: center;
  .ant-transfer-list-content,
  .ant-transfer-list-body-not-found {
    height: 40vh;
    overflow-y: auto;
  }
  .ant-transfer-list-body-not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ant-transfer-list-content-item-text {
    color: ${DarkTextColor};
  }
`;

const TransferHeaderCalss = css`
  display: flex;
  jusfity-content: space-between;
  margin-bottom: 8px;
  > div {
    flex: 1;
    &:last-of-type {
      padding-left: 40px;
    }
  }
`;

interface UserTransferModalProps extends ModalFormProps {
  roleId?: number;
  onConfirm(data: API.RoleBindUserParams): void;
}

const UserTransferModal: React.FC<UserTransferModalProps> = ({
  roleId,
  onConfirm,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<API.RoleUserItem[]>([]);
  const originData = useRef<{
    bindUser: API.RoleUserItem[];
    unBindUser: API.RoleUserItem[];
  }>();

  useEffect(() => {
    if (roleId) {
      setLoading(true);
      queryRoleUserLists(roleId)
        .then((data) => {
          const { bindUser, unBindUser } = data;
          originData.current = data;
          setTargetKeys(bindUser.map((user) => user.key));
          setDataSource(
            [...unBindUser, ...bindUser].sort((aUser, bUser) => {
              return aUser.id - bUser.id;
            })
          );
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {
      setTargetKeys([]);
      setDataSource([]);
    };
  }, [roleId]);

  const onChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const onFinish = async () => {
    if (roleId === undefined || !originData.current) return;

    const unbindUsers = originData.current.bindUser?.filter(
      (user) => !targetKeys.includes(user.key)
    );

    return onConfirm({
      roleId,
      bindUsers: targetKeys?.length ? targetKeys.map(Number) : [],
      unbindUsers: unbindUsers?.map((user) => user.id),
    });
  };

  const filterOption = (inputValue: string, option: API.RoleUserItem) =>
    option.firstName.indexOf(inputValue) > -1;

  return (
    <AutoResetModalForm
      title='关联用户'
      modalProps={{
        centered: true,
        closable: false,
        maskClosable: false,
        bodyStyle: {
          paddingTop: 8,
          paddingBottom: 20,
          paddingInline: 0,
        },
      }}
      width='fit-content'
      {...props}
      onFinish={onFinish}
    >
      {roleId && (
        <div className={TransferContainerClass}>
          {loading ? (
            <Spin size='large' />
          ) : (
            <>
              <div className={TransferHeaderCalss}>
                <div>待选用户</div>
                <div>已选用户</div>
              </div>
              <Transfer
                targetKeys={targetKeys}
                dataSource={dataSource}
                onChange={onChange}
                render={(item) => item.firstName}
                pagination
                className={TransferClass}
                showSelectAll={false}
                showSearch
                filterOption={filterOption}
              />
            </>
          )}
        </div>
      )}
    </AutoResetModalForm>
  );
};

export default memo(UserTransferModal);
