import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';
import { useGetStudentClubsQuery } from '../redux/studentClubs.api';

export const useStudentClubs = () => {
  const { roleType, departmentId, clubId, clubName } = useAppSelector(authState);

  const scopedFilters = useMemo(() => {
    if (roleType === 'CLUB' && clubId) {
      return { id: clubId };
    }
    if (roleType === 'DEPARTMENT-ADMIN' && departmentId) {
      return { department: departmentId };
    }
    return undefined;
  }, [roleType, departmentId, clubId]);

  const args = useMemo(() => {
    const base = {
      search: '',
      paginationModel: { page: 0, pageSize: 200 },
      sortModel: [],
      filterModel: { items: [] as never[] }
    };
    if (scopedFilters && Object.keys(scopedFilters).length) {
      return { ...base, filters: scopedFilters };
    }
    return base;
  }, [scopedFilters]);

  const skipFetch = useMemo(() => ['UNION', 'CAMPUS-UNIT', 'CAMPUS-SECTION'].includes(roleType || ''), [roleType]);

  const { data, isFetching } = useGetStudentClubsQuery(args, { skip: skipFetch });

  const fallbackOptions = useMemo<SelectOption[]>(() => {
    if (roleType === 'CLUB' && clubId) {
      return [
        {
          label: clubName || 'My Club',
          value: String(clubId)
        }
      ];
    }
    return [];
  }, [roleType, clubId, clubName]);

  const studentClubsOptions = useMemo<SelectOption[]>(() => {
    if (skipFetch) return fallbackOptions;
    const mapped =
      data?.results.map((club) => ({
        label: club.name,
        value: String(club.id)
      })) ?? [];
    if (!mapped.length && fallbackOptions.length) {
      return fallbackOptions;
    }
    return mapped;
  }, [data, skipFetch, fallbackOptions]);

  return { studentClubsOptions, loading: isFetching && !skipFetch };
};
