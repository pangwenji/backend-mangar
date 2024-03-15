import produce, { enableAllPlugins } from 'immer';
import { omit } from 'lodash';
import { useCallback, useReducer } from 'react';

import type { UploadWinInfo, UploadWinItem } from '@/models/typings';
import type { VideoCategory } from '@/services/enums';

enableAllPlugins();

const UploadWinDispatchType = {
  Add: 'ADD_UPLOAD_ITEM',
  Update: 'UPDATE_UPLOAD_ITEM',
  Del: 'DEL_UPLOAD_ITEM',
  UpdatePercent: 'UPDATE_UPLOAD_ITEM_PERCENT',
  SetList: 'SET_UPLOAD_ITEM_LIST',
  DelPendingItem: 'DEL_PENDING_ITEM',
};

export default () => {
  const [uploadItemList, dispatch] = useReducer(
    produce((draft: UploadWinItem[], action) => {
      switch (action.type) {
        case UploadWinDispatchType.SetList:
          draft = action.list;
          break;
        case UploadWinDispatchType.Del: {
          const deleteIndex = draft.findIndex((uploadItem) => uploadItem?.id === action.id);
          if (deleteIndex > -1) {
            draft.splice(deleteIndex, 1);
          }
          break;
        }
        case UploadWinDispatchType.UpdatePercent: {
          const updateIndex = draft.findIndex((uploadItem) => uploadItem?.id === action.info.id);
          const newWinInfo = omit(action.info, 'id');
          if (updateIndex > -1) {
            const prevInfo = draft[updateIndex].winInfo || {};

            draft[updateIndex].winInfo = {
              ...prevInfo,
              ...newWinInfo,
            } as UploadWinItem['winInfo'];

            if (newWinInfo.path) {
              draft[updateIndex].url = newWinInfo.path;
            }
          }
          break;
        }
        case UploadWinDispatchType.Add: {
          const addIndex = draft.findIndex((uploadItem) => uploadItem?.id === action.item.id);
          if (addIndex > -1) {
            draft[addIndex] = action.item;
          } else {
            draft.push(action.item);
          }
          break;
        }
        case UploadWinDispatchType.Update: {
          const addIndex = draft.findIndex((uploadItem) => uploadItem?.id === action.item.id);
          if (addIndex > -1) {
            draft[addIndex] = action.item;
          }
          break;
        }
        case UploadWinDispatchType.DelPendingItem: {
          draft.forEach((item) => {
            if (item.winInfo?.submitting) {
              item.winInfo.pending = false;
            }
          });
          return draft.filter((item) => !item.winInfo?.pending);
        }
        default:
          break;
      }
    }),
    /* initial uploadList */
    [] as UploadWinItem[],
  );

  const handleAddUploadItem = useCallback((item: Omit<UploadWinItem, 'id'> & { id?: number }) => {
    dispatch({
      type: UploadWinDispatchType.Add,
      item: {
        id: Date.now(),
        ...item,
        winInfo: {
          ...item.winInfo,
          percent: 0,
          pending: true,
        },
      },
    });
  }, []);

  const handleUpdateUploadItem = useCallback((item: UploadWinItem) => {
    dispatch({
      type: UploadWinDispatchType.Update,
      item,
    });
  }, []);

  const handleDeleteUploadItem = useCallback((id: number) => {
    dispatch({
      type: UploadWinDispatchType.Del,
      id,
    });
  }, []);

  const handleDeletePendingItem = useCallback(() => {
    dispatch({
      type: UploadWinDispatchType.DelPendingItem,
    });
  }, []);

  const handleUploadItemProgress = useCallback(
    (info: { id: number; type?: VideoCategory } & Omit<UploadWinInfo, 'type'>) => {
      dispatch({
        type: UploadWinDispatchType.UpdatePercent,
        info,
      });
    },
    [],
  );

  const handleSetUploadWins = useCallback((list: UploadWinItem[]) => {
    dispatch({
      type: UploadWinDispatchType.UpdatePercent,
      list,
    });
  }, []);

  return {
    uploadItemList,
    handleAddUploadItem,
    handleUpdateUploadItem,
    handleDeleteUploadItem,
    handleDeletePendingItem,
    handleUploadItemProgress,
    handleSetUploadWins,
  };
};
