import { queryCommandList } from '@/services/api';
import { useAccess } from '@umijs/max';
import { Button, Form, Input, message, Space, Typography } from 'antd';
import React, { memo, useRef, useState } from 'react';

import MySelect from '@/components/MyFormSelect/MySelect';
import MyModalWrapper from '@/components/MyModalWrapper';
import MyTable from '@/components/MyTable';
import type { API } from '@/services/typings';
import { createEditableCol } from '@/utils/tableCols';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { isEqual, pick } from 'lodash';
import type { FieldError } from 'rc-field-form/es/interface';
import { handleCommandPreview, handleCommandUpdate } from '../actions';
const { Text } = Typography;

const InputDisabledCommandTypes = [2, 9]; // 2[數字].[金額]; 9[个位][数字].[金额]
const ShowHandCommandType = 4; // 梭哈

const getNeedUpdateCommands = (
  commands: API.CommandEdit[],
  originCommands: API.CommandEdit[]
) => {
  const sortedCommands = [...commands].sort(
    (aCommand, bCommand) => aCommand.id - bCommand.id
  );
  const sortedOriginCommands = [...originCommands].sort(
    (aCommand, bCommand) => aCommand.id - bCommand.id
  );
  return sortedCommands.filter((command, index) => {
    const originCommand = sortedOriginCommands[index];
    const equal = isEqual(originCommand, command);
    return !equal;
  });
};

const formatUndefined = (val: any) => {
  return val === undefined ? null : val;
};

const formatFieldCommands = (
  field: Record<number, Omit<API.CommandEdit, 'id'>> = {}
) => {
  return Object.entries(field).reduce(
    (
      res,
      [id, { commandDelimiter, commandType, chineseCommand, englishCommand }]
    ) => {
      res.push({
        commandDelimiter: formatUndefined(commandDelimiter),
        commandType: formatUndefined(commandType),
        chineseCommand: formatUndefined(chineseCommand),
        englishCommand: formatUndefined(englishCommand),
        id: Number(id),
      });
      return res;
    },
    [] as API.CommandEdit[]
  );
};

const formatCommandList = (commands: API.Command[]) =>
  commands.map(
    (command) =>
      pick(command, [
        'id',
        'commandType',
        'commandDelimiter',
        'chineseCommand',
        'englishCommand',
      ]) as API.CommandEdit
  );

const CommandList: React.FC<{ lotteryCode: string }> = ({
  lotteryCode: gameCode,
}) => {
  const access = useAccess();
  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [commandOptions, setCommandOptions] = useState<API.CommandOptions>();
  // 服务器更新前后记录
  const [originCommands, setOriginCommands] = useState<API.CommandEdit[]>([]);
  // 预览前后的记录
  const [editedCommands, setEditedCommands] = useState<API.CommandEdit[]>([]);
  // 表格显示数据源
  const [dataSource, setDataSource] = useState<API.Command[]>([]);
  const [editForm] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const initDataSource = async () => {
    if (!gameCode) {
      return {
        success: true,
      };
    }
    setLoading(true);
    editForm?.resetFields();
    try {
      const { commands, commandTypes, commandDelimiterTypes } =
        await queryCommandList({ gameCode });
      if (!commandOptions) {
        setCommandOptions({ commandTypes, commandDelimiterTypes });
      }
      const formartCommands = formatCommandList(commands);
      setOriginCommands([...formartCommands]);
      setEditedCommands([...formartCommands]);
      setEditableRowKeys(commands.map((item) => item.id));
      setDataSource(commands);
      return { success: true };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新预览
  const updatePreview = async (
    index: number | undefined,
    data: Partial<API.CommandEdit>
  ) => {
    // index 不存在 / 验证不通过
    if (!Number.isInteger(index)) return;
    const editedCommand = editedCommands[index!];
    const newCommandEdit = {
      ...editedCommand,
      ...data,
    };
    // 处理不可输入指令的指令类型
    const isInputDisabledCommandType =
      typeof data.commandType === 'number' &&
      InputDisabledCommandTypes.includes(data.commandType);
    if (isInputDisabledCommandType) {
      newCommandEdit.chineseCommand = '';
      newCommandEdit.englishCommand = '';
    }
    // 没有变动不更新预览
    if (isEqual(editedCommand, newCommandEdit)) return;

    // 重置上一次配置
    const resetCommand = () => {
      const dataIndex = Object.keys(data)[0] as keyof API.CommandEdit;
      editForm?.setFieldValue(
        [originCommands[index!].id, dataIndex],
        editedCommand[dataIndex]
      );
    };

    // 检查是否通过表单 rule
    try {
      await editForm.validateFields();
    } catch (err: any) {
      const error = err as { errorFields: FieldError[] };
      if (error.errorFields) {
        // 是否是当前预览项检查不通过
        const targetError = error.errorFields?.find(
          (fields) => Number(fields.name[0]) === editedCommand.id
        );
        if (targetError) {
          message.error(targetError.errors[0]);
          resetCommand();
          return;
        }
      }
    }
    const newPreviewText = await handleCommandPreview(newCommandEdit);
    if (newPreviewText !== false) {
      // 更新数据源
      setDataSource((source) => {
        source[index!].commandList = newPreviewText;
        // 处理不可输入指令的指令类型
        if (isInputDisabledCommandType) {
          const id = source[index!].id;
          editForm.setFieldValue(
            [id, 'chineseCommand'],
            newCommandEdit.chineseCommand
          );
          editForm.setFieldValue(
            [id, 'englishCommand'],
            newCommandEdit.englishCommand
          );
        }
        return [...source];
      });
      // 同步编辑记录
      setEditedCommands((list) => {
        list[index!] = newCommandEdit;
        return [...list];
      });
    } else {
      resetCommand();
    }
  };

  const createSelectItemRender = (
    key: string
  ): ProColumns<API.CommandEdit>['renderFormItem'] => {
    return ({ valueEnum, index }, config, _) => {
      return (
        <MySelect
          isNumber
          {...pick(config, ['onChange', 'onSelect', 'value'])}
          valueEnum={valueEnum}
          onChange={async (value) => {
            config.onChange?.(value);
            updatePreview(index, {
              [key]: value,
            });
          }}
        />
      );
    };
  };

  const createInputItemRender = (
    key: string
  ): ProColumns<API.CommandEdit>['renderFormItem'] => {
    return ({ index }, config) => {
      return (
        <Input
          {...pick(config, ['onChange', 'onSelect', 'value'])}
          disabled={InputDisabledCommandTypes.includes(
            editedCommands[index!].commandType
          )}
          onBlur={(ev) => {
            updatePreview(index, {
              [key]: ev.currentTarget.value,
            });
          }}
        />
      );
    };
  };

  const createInputItemProps = (
    key: keyof API.CommandEdit
  ): ProColumns<API.CommandEdit>['formItemProps'] => {
    return (_, { rowIndex, index }) => {
      const itemProps = {};
      const commandIndex = index || rowIndex;
      if (!Number.isInteger(commandIndex)) return itemProps;
      const entity = editedCommands[commandIndex!];
      // 指令配置规则：
      // 同一个经典指令，配置的指令不重复
      // 梭哈中文指令除外
      const commandTextList = editedCommands
        .filter((command) => {
          // 1. 不是本条 command
          if (command.id === entity.id) return false;
          // 2. 如果是中文指令，且类型为梭哈，则不和其他梭哈中文对比
          if (
            key === 'chineseCommand' &&
            entity.commandType === ShowHandCommandType
          ) {
            return false;
          }
          // 3. 筛选出相同经典指令
          return command.commandType === entity.commandType;
        })
        .map((command) => command[key])
        .filter(Boolean);

      return {
        rules: [
          {
            validateTrigger: ['onBlur', 'onChange'],
            validator(_, value) {
              if (commandTextList.includes(value)) {
                return Promise.reject('请勿重复指令');
              }

              return Promise.resolve();
            },
          },
        ],
      };
    };
  };

  const createInputShouldCellUpdate = (dataIndex: keyof API.CommandEdit) => {
    return ((record, prev) => {
      if (
        !isEqual(record[dataIndex], prev[dataIndex]) ||
        !isEqual(record.commandType, prev.commandType)
      ) {
        editForm?.setFieldValue([record.id, dataIndex], record[dataIndex]);
      }
      return true;
    }) as ProColumns<API.CommandEdit>['shouldCellUpdate'];
  };

  const createInputCol = (col: ProColumns<API.CommandEdit>) => {
    return {
      ...col,
      fieldProps: { allowClear: false },
      ...(!!col.dataIndex && {
        formItemProps: createInputItemProps(
          col.dataIndex as keyof API.CommandEdit
        ),
        renderFormItem: createInputItemRender(
          col.dataIndex as keyof API.CommandEdit
        ),
        shouldCellUpdate: createInputShouldCellUpdate(
          col.dataIndex as keyof API.CommandEdit
        ),
      }),
      editable: true,
    };
  };

  const handleUpdateConfirm = async () => {
    // 是否通过检查
    try {
      await editForm.validateFields();
    } catch (err: any) {
      // 报错提醒
      const error = err as { errorFields: FieldError[] };
      if (error.errorFields) {
        message.error('存在重复指令，请修改后更新');
        return true;
      }
      return;
    }
    const fieldCommands = formatFieldCommands(editForm.getFieldsValue());
    const need2Update = getNeedUpdateCommands(fieldCommands, originCommands);

    if (need2Update.length) {
      setLoading(true);
      if (await handleCommandUpdate(need2Update)) {
        actionRef.current?.reload?.();
      }
      setLoading(false);
    } else {
      message.warning('当前没有需要更新的指令');
    }
    return true;
  };

  const columns: ProColumns<API.Command>[] = (
    [
      { title: '玩法', dataIndex: 'playName', width: 100 },
      createEditableCol(
        {
          title: '经典指令格式',
          dataIndex: 'commandType',
          valueEnum: commandOptions?.commandTypes,
          ellipsis: false,
          renderFormItem: createSelectItemRender('commandType'),
        },
        editForm
      ),
      createEditableCol(
        {
          title: '指令间隔符',
          dataIndex: 'commandDelimiter',
          valueEnum: commandOptions?.commandDelimiterTypes,
          ellipsis: false,
          width: 140,
          renderFormItem: createSelectItemRender('commandDelimiter'),
        },
        editForm
      ),
      createInputCol({ title: '中文指令', dataIndex: 'chineseCommand' }),
      createInputCol({
        title: (
          <Space direction='vertical' style={{ flex: 1 }} size={0}>
            <Text>英文指令</Text>
            <Text type='secondary'>不区分大小写</Text>
          </Space>
        ),
        dataIndex: 'englishCommand',
      }),
      { title: '指令集', dataIndex: 'commandList', width: 300 },
    ] as ProColumns<API.Command>[]
  ).map((col) => {
    return {
      ellipsis: true,
      hideInSearch: true,
      editable: false,
      hideInForm: true,
      ...col,
    };
  });
  return (
    access.CHAT_MANAGEMENT_DIRECT_01 && (
      <MyTable<API.Command, any>
        loading={loading}
        dataSource={dataSource}
        headerTitle={
          access.CHAT_MANAGEMENT_DIRECT_02 && (
            <Space>
              <MyModalWrapper
                key='refresh'
                content='确认要更新配置吗'
                onFinish={handleUpdateConfirm}
              >
                <Button type='primary' key='create-item'>
                  更新指令
                </Button>
              </MyModalWrapper>
              <Text>多指令请以“空格”分割</Text>
            </Space>
          )
        }
        actionRef={actionRef}
        request={initDataSource}
        search={false}
        scroll={{ x: 1100, y: '75vh' }}
        // @ts-ignore
        editable={
          access.CHAT_MANAGEMENT_DIRECT_02 && {
            form: editForm,
            type: 'multiple',
            editableKeys: editableKeys,
            onChange: setEditableRowKeys,
          }
        }
        columns={columns}
        pagination={false}
      />
    )
  );
};
export default memo(CommandList);
