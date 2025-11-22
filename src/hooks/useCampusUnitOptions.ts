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
  const [unitName, setUnitName] = useState<string | null>(null);
  const { roleType, campusUnitId, campusUnitName } = useAppSelector(authState);
  const skipFetch = useMemo(() => ['DEPARTMENT-ADMIN', 'UNION', 'CLUB'].includes(roleType || ''), [roleType]);

  // Fetch unit name if missing from auth state
  useEffect(() => {
    if (roleType === 'CAMPUS-UNIT' && campusUnitId && !campusUnitName) {
      const fetchUnitName = async () => {
        try {
          const response = await axiosInstance.get(`cms/website-mod/campus-units/${campusUnitId}`);
          if (response.data?.name) {
            setUnitName(response.data.name);
          }
        } catch (error) {
          console.error('Failed to fetch unit name', error);
        }
      };
      fetchUnitName();
    }
  }, [roleType, campusUnitId, campusUnitName]);

  const lockedOption = useMemo(() => {
    if (roleType === 'CAMPUS-UNIT' && campusUnitId) {
      const displayName = campusUnitName || unitName || 'My Unit';
      const option = { label: displayName, value: String(campusUnitId) };
      console.log(
        'Campus Unit locked option created (STRING VALUE):',
        option,
        'roleType:',
        roleType,
        'campusUnitId:',
        campusUnitId,
        'campusUnitName:',
        campusUnitName,
        'fetchedUnitName:',
        unitName
      );
      return [option];
    }
    return null;
  }, [roleType, campusUnitId, campusUnitName, unitName]);

  useEffect(() => {
    let isMounted = true;

    const fetchUnits = async () => {
      if (skipFetch) {
        setOptions(lockedOption ?? []);
        return;
      }
      if (lockedOption) {
        console.log('Setting locked campus unit options:', lockedOption);
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
          value: String(unit.id)
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
  }, [lockedOption, skipFetch]);

  return {
    options
  };
};
