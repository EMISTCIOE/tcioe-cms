import { usePatchGlobalEventsMutation } from '../redux/globalEvents.api';
import { useAppDispatch } from '@/libs/hooks';
import { setMessage } from '@/pages/common/redux/common.slice';

export const useGlobalEventsApprovalChange = () => {
  const [patchGlobalEvent] = usePatchGlobalEventsMutation();
  const dispatch = useAppDispatch();

  const onApprovalChange = async (id: string, field: 'isApprovedByDepartment' | 'isApprovedByCampus', value: boolean) => {
    if (value === undefined || value === null) return;
    try {
      const payload: any = {};
      payload[field] = value;

      const res = await patchGlobalEvent({ id, values: payload }).unwrap();
      dispatch(setMessage({ message: res.message, variant: 'success' }));
    } catch (error) {
      console.error('Failed to update global event approval flag:', error);
    }
  };

  return { onApprovalChange };
};

export default useGlobalEventsApprovalChange;
