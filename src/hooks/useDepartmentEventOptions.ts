import { useEffect, useMemo, useState } from 'react';
import { SelectOption } from '@/components/app-form/types';
import { axiosInstance } from '@/libs/axios';

export const useDepartmentEventOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get('cms/department-mod/global-events', {
          params: { limit: 200 }
        });
        if (!isMounted) return;
        const events = response.data?.results || [];
        const mapped = events.map((event: any) => ({
          label: event.title || 'Untitled',
          value: event.id
        }));
        setOptions(mapped);
      } catch (error) {
        console.error('Failed to load department events', error);
      }
    };

    fetchOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(() => ({ options }), [options]);
};
