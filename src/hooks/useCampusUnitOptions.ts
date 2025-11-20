import { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

interface CampusUnitOption {
  id: string;
  name: string;
}

export const useCampusUnitOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const { roleType, campusUnitId, campusUnitName } = useAppSelector(authState);

  const lockedOption = useMemo(() => {
    if (roleType === 'CAMPUS-UNIT' && campusUnitId) {
      return [{ label: campusUnitName || 'My Unit', value: String(campusUnitId) }];
    }
    return null;
  }, [roleType, campusUnitId, campusUnitName]);

  useEffect(() => {
    let isMounted = true;

    const fetchUnits = async () => {
      if (lockedOption) {
        setOptions(lockedOption);
        return;
      }
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
  }, [lockedOption]);

  return {
    options
  };
};
