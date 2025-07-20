import { SelectOption } from '@/components/app-form/types';
import { useMemo } from 'react';
import { useGetNoticeCategoriesQuery } from '../redux/notice.api';

export const useNoticeCategories = () => {
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 100 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data: noticeCategoriesData, isLoading } = useGetNoticeCategoriesQuery(args);

  const noticeCategoriesOptions = useMemo<SelectOption[]>(() => {
    return (
      noticeCategoriesData?.results?.map((category) => ({
        label: category.name,
        value: category.id
      })) || []
    );
  }, [noticeCategoriesData]);

  return { noticeCategoriesOptions, isLoading };
};
