import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { useGetStudentClubsQuery } from '../redux/studentClubs.api';

export const useStudentClubs = () => {
  const { roleType } = useAppSelector(authState);
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 200 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const skipFetch = useMemo(
    () => ['UNION', 'CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || ''),
    [roleType]
  );

  const { data, isFetching } = useGetStudentClubsQuery(args, { skip: skipFetch });

  const studentClubsOptions = useMemo<SelectOption[]>(() => {
    if (skipFetch) return [];
    return (
      data?.results.map((club) => ({
        label: club.name,
        value: String(club.id)
      })) ?? []
    );
  }, [data, skipFetch]);

  return { studentClubsOptions, loading: isFetching && !skipFetch };
};
