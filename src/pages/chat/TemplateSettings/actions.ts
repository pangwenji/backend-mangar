import { updateChatTemplate } from '@/services/api';
import type { API } from '@/services/typings';
import { message } from 'antd';
import { isEqual } from 'lodash';

/**
 * 更新模板
 *
 * @param fields
 */

export const handleChatTemplateUpdate = async (
  fields: API.ChatTemplateEdit,
  currentRow: API.ChatTemplate
) => {
  if (isEqual(currentRow.contents, fields.contents)) {
    message.info('无变更内容');
    return true;
  }

  const hide = message.loading('正在更新模板');

  try {
    await updateChatTemplate(fields);
    hide();
    message.success('更新模板成功');
    return true;
  } catch (error: any) {
    hide();
    // message.error('更新模板失败, 请重试！');
    return false;
  }
};
