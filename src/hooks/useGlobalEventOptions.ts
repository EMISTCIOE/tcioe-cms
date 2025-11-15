import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useGetGlobalEventsQuery } from '@/pages/website-setup/global-events/redux/globalEvents.api';

export const useGlobalEventOptions = () => {
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 200 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data, isFetching } = useGetGlobalEventsQuery(args);

  const options = useMemo<SelectOption[]>(() => {
    return (
      data?.results.map((event) => ({
        label: event.title || 'Untitled',
        value: event.id
      })) ?? []
    );
  }, [data]);

  return { options, loading: isFetching };
};
