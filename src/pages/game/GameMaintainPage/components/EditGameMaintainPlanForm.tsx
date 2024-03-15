import AutoResetModalForm from '@/components/AutoResetModalForm';
import React from 'react';

import MyFormSelect from '@/components/MyFormSelect';
import NumValueSelect from '@/components/NumValueSelect';
import { queryGameMenu } from '@/services/api';
import { MaintenancePeriodEnums } from '@/services/enums';
import {
  ProFormTimePicker,
  type ModalFormProps,
} from '@ant-design/pro-components';

const EditGameMaintainPlanForm: React.FC<ModalFormProps<any>> = ({
  ...props
}) => {
  const { initialValues, ...restProps } = props;
  const isEdit = !!initialValues;
  const title = isEdit ? '编辑维护计划' : '新增维护计划';
  return (
    <AutoResetModalForm
      title={title}
      initialValues={initialValues}
      colProps={{ span: 24 }}
      {...restProps}
    >
      {!isEdit && (
        <MyFormSelect
          name='gameCode'
          label='游戏名称'
          request={queryGameMenu}
          fieldProps={{
            fieldNames: {
              label: 'gameName',
              value: 'gameCode',
            },
          }}
          rules={[{ required: true }]}
        />
      )}
      <NumValueSelect
        name='period'
        label='维护周期'
        rules={[{ required: true }]}
        valueEnum={MaintenancePeriodEnums}
      />
      <ProFormTimePicker.RangePicker
        name='timeRange'
        label='时间区间'
        rules={[{ required: true }]}
        initialValue={
          initialValues && [initialValues.startTime, initialValues.endTime]
        }
        transform={(value) => {
          if (!Array.isArray(value)) return undefined;
          return {
            startTime: value[0],
            endTime: value[1],
          };
        }}
      />
    </AutoResetModalForm>
  );
};

export default EditGameMaintainPlanForm;
