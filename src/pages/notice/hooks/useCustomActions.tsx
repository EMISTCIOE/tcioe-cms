import { GridRowParams } from '@mui/x-data-grid';

import { useDispatch } from 'react-redux';
import { currentNoticeId, setEdit } from '../redux/notice.slice';

import { ITableData } from '../components/listing/config.tsx';

export const useCustomActions = () => {
  const dispatch = useDispatch();

  const actions = [];

  // Placeholder for future contextual actions

  return actions;
};
