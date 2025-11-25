import { usePatchNoticeStatusMutation } from '../redux/notice.api';
import { ITableData } from '../components/listing/config';
import { NoticeStatus } from '../redux/types';
import { GridRowId } from '@mui/x-data-grid';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';

export const useNoticeStatusChange = () => {
  const [patchNoticeStatus] = usePatchNoticeStatusMutation();
  const dispatch = useAppDispatch();

  const onStatusChange = async (id: GridRowId, value: ITableData[keyof ITableData]) => {
    // Always send APPROVED regardless of selected value to match backend enforcement.
    try {
      const res = await patchNoticeStatus({
        id,
        values: { status: NoticeStatus.APPROVED }
      }).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
    } catch (error) {
      console.error('Failed to update notice status:', error);
    }
  };

  return { onStatusChange };
};
