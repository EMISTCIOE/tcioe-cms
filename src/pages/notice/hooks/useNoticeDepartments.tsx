import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useGetNoticeDepartmentsQuery } from '../redux/notice.api';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

export const useNoticeDepartments = () => {
  const { roleType } = useAppSelector(authState);
  const skip = ['CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || '');
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 100 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data: noticeDepartmentsData, isLoading } = useGetNoticeDepartmentsQuery(args, { skip });

  const noticeDepartmentsOptions = useMemo<SelectOption[]>(() => {
    return (
      noticeDepartmentsData?.results?.map((department) => ({
        label: department.name,
        value: String(department.id)
      })) || []
    );
  }, [noticeDepartmentsData]);

  const updatedNoticeDepartmentsOptions = useMemo(() => {
    return [{ label: 'NA', value: null }, ...noticeDepartmentsOptions];
  }, [noticeDepartmentsOptions]);

  return { noticeDepartmentsOptions: updatedNoticeDepartmentsOptions, isLoading };
};
