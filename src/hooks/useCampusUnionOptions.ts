import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';

interface CampusUnionOption {
  id: string;
  name: string;
}

export const useCampusUnionOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUnions = async () => {
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
          value: union.id
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
  }, []);

  return {
    options
  };
};
