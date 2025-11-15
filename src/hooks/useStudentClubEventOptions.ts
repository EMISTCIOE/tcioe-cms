import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useGetStudentClubEventsQuery } from '@/pages/student-clubs-setup/student-club-events/redux/studentClubEvents.api';

export const useStudentClubEventOptions = () => {
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 100 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data, isFetching } = useGetStudentClubEventsQuery(args);

  const options = useMemo<SelectOption[]>(() => {
    return (
      data?.results.map((event) => ({
        label: event.title,
        value: event.id
      })) ?? []
    );
  }, [data]);

  return { options, loading: isFetching };
};
