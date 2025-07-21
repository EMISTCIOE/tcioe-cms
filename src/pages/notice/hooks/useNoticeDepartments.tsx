import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useGetNoticeDepartmentsQuery } from '../redux/notice.api';

export const useNoticeDepartments = () => {
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 100 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data: noticeDepartmentsData, isLoading } = useGetNoticeDepartmentsQuery(args);

  const noticeDepartmentsOptions = useMemo<SelectOption[]>(() => {
    return (
      noticeDepartmentsData?.results?.map((department) => ({
        label: department.name,
        value: department.id
      })) || []
    );
  }, [noticeDepartmentsData]);

  const updatedNoticeDepartmentsOptions = useMemo(() => {
    return [{ label: 'NA', value: null }, ...noticeDepartmentsOptions];
  }, [noticeDepartmentsOptions]);

  return { noticeDepartmentsOptions: updatedNoticeDepartmentsOptions, isLoading };
};
