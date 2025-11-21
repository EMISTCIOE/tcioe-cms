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
  const [sectionName, setSectionName] = useState<string | null>(null);
  const { roleType, campusSectionId, campusSectionName } = useAppSelector(authState);

  // Fetch section name if missing from auth state
  useEffect(() => {
    if (roleType === 'CAMPUS-SECTION' && campusSectionId && !campusSectionName) {
      const fetchSectionName = async () => {
        try {
          const response = await axiosInstance.get(`cms/website-mod/campus-sections/${campusSectionId}`);
          if (response.data?.name) {
            setSectionName(response.data.name);
          }
        } catch (error) {
          console.error('Failed to fetch section name', error);
        }
      };
      fetchSectionName();
    }
  }, [roleType, campusSectionId, campusSectionName]);

  const lockedOption = useMemo(() => {
    if (roleType === 'CAMPUS-SECTION' && campusSectionId) {
      const displayName = campusSectionName || sectionName || 'My Section';
      return [{ label: displayName, value: String(campusSectionId) }];
    }
    return null;
  }, [roleType, campusSectionId, campusSectionName, sectionName]);

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
          value: String(section.id)
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
