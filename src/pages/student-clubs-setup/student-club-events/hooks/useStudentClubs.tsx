import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useGetStudentClubsQuery } from '@/pages/student-clubs-setup/student-clubs/redux/studentClubs.api';

export const useStudentClubs = () => {
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 100 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data: studentClubsData, isLoading } = useGetStudentClubsQuery(args);

  const studentClubsOptions = useMemo<SelectOption[]>(() => {
    return (
      studentClubsData?.results?.map((club) => ({
        label: club.name,
        value: club.id
      })) || []
    );
  }, [studentClubsData]);

  // const updatedStudentClubsOptions = useMemo(() => {
  //   return [{ label: 'NA', value: null }, ...studentClubsOptions];
  // }, [studentClubsOptions]);

  return { studentClubsOptions: studentClubsOptions, isLoading };
};
