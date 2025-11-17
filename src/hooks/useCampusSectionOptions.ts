import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';

interface CampusSectionOption {
  id: number;
  name: string;
}

export const useCampusSectionOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchSections = async () => {
      try {
        const response = await axiosInstance.get('cms/website-mod/campus-sections', {
          params: {
            offset: 0,
            limit: 200
          }
        });

        if (!isMounted) return;

        const sections: CampusSectionOption[] = response.data?.results || [];
        const mapped = sections.map((section) => ({
          label: section.name,
          value: section.id
        }));
        setOptions(mapped);
      } catch (error) {
        console.error('Failed to load campus sections', error);
      }
    };

    fetchSections();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    options
  };
};
