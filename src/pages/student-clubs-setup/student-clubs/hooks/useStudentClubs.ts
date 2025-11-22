import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useGetStudentClubsQuery } from '../redux/studentClubs.api';

export const useStudentClubs = () => {
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 200 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data, isFetching } = useGetStudentClubsQuery(args);

  const studentClubsOptions = useMemo<SelectOption[]>(() => {
    return (
      data?.results.map((club) => ({
        label: club.name,
        value: String(club.id)
      })) ?? []
    );
  }, [data]);

  return { studentClubsOptions, loading: isFetching };
};
