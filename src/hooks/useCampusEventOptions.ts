import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useGetCampusEventsQuery } from '@/pages/website-setup/campus-events/redux/campusEvents.api';

export const useCampusEventOptions = () => {
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 100 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data, isFetching } = useGetCampusEventsQuery(args);

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
