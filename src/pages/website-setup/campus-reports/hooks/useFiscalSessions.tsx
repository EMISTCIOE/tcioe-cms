import { useMemo } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { useGetFiscalSessionsQuery } from '../redux/campusReports.api';

export const useFiscalSessions = () => {
  const args = {
    search: '',
    paginationModel: { page: 0, pageSize: 100 },
    sortModel: [],
    filterModel: { items: [] }
  };

  const { data: fiscalSessionsData, isLoading } = useGetFiscalSessionsQuery(args);

  const fiscalSessionsOptions = useMemo<SelectOption[]>(() => {
    return (
      fiscalSessionsData?.results?.map((fiscalSession) => ({
        label: fiscalSession.sessionShort,
        value: fiscalSession.id
      })) || []
    );
  }, [fiscalSessionsData]);

  return { fiscalSessionsOptions, isLoading };
};
