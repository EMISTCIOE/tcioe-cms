import { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

interface CampusUnionOption {
  id: string;
  name: string;
}

export const useCampusUnionOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const { roleType } = useAppSelector(authState);
  const skipFetch = useMemo(() => ['CAMPUS-UNIT', 'CAMPUS-SECTION', 'CLUB'].includes(roleType || ''), [roleType]);

  useEffect(() => {
    let isMounted = true;

    const fetchUnions = async () => {
      if (skipFetch) {
        setOptions([]);
        return;
      }
      try {
        const response = await axiosInstance.get('cms/website-mod/campus-unions', {
          params: {
            offset: 0,
            limit: 200
          }
        });

        if (!isMounted) return;

        const unions: CampusUnionOption[] = response.data?.results || [];
        const mapped = unions.map((union) => ({
          label: union.name,
          value: String(union.id)
        }));
        setOptions(mapped);
      } catch (error) {
        console.error('Failed to load campus unions', error);
      }
    };

    fetchUnions();

    return () => {
      isMounted = false;
    };
  }, [skipFetch]);

  return {
    options
  };
};
