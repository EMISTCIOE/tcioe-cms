import { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

interface CampusSectionOption {
  id: string;
  name: string;
}

export const useCampusSectionOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const { roleType, campusSectionId, campusSectionName } = useAppSelector(authState);

  const lockedOption = useMemo(() => {
    if (roleType === 'CAMPUS-SECTION' && campusSectionId) {
      return [{ label: campusSectionName || 'My Section', value: String(campusSectionId) }];
    }
    return null;
  }, [roleType, campusSectionId, campusSectionName]);

  useEffect(() => {
    let isMounted = true;

    const fetchSections = async () => {
      if (lockedOption) {
        setOptions(lockedOption);
        return;
      }
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
  }, [lockedOption]);

  return {
    options
  };
};
