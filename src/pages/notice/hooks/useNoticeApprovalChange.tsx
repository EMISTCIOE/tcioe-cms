import { usePatchNoticeMutation } from '../redux/notice.api';
import { GridRowId } from '@mui/x-data-grid';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';

export const useNoticeApprovalChange = () => {
  const [patchNotice] = usePatchNoticeMutation();
  const dispatch = useAppDispatch();

  const onApprovalChange = async (id: GridRowId, field: 'isApprovedByDepartment' | 'isApprovedByCampus', value: boolean) => {
    if (value === undefined || value === null) return;
    try {
      const payload: any = {};
      payload[field] = value ? 'true' : 'false';

      const res = await patchNotice({ id, values: payload }).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
    } catch (error) {
      console.error('Failed to update approval flag:', error);
    }
  };

  return { onApprovalChange };
};

export default useNoticeApprovalChange;
