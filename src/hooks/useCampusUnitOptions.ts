import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';

interface CampusUnitOption {
  id: number;
  name: string;
}

export const useCampusUnitOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchUnits = async () => {
      try {
        const response = await axiosInstance.get('cms/website-mod/campus-units', {
          params: {
            offset: 0,
            limit: 200
          }
        });

        if (!isMounted) return;

        const units: CampusUnitOption[] = response.data?.results || [];
        const mapped = units.map((unit) => ({
          label: unit.name,
          value: unit.id
        }));
        setOptions(mapped);
      } catch (error) {
        console.error('Failed to load campus units', error);
      }
    };

    fetchUnits();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    options
  };
};
