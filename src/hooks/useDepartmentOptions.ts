import { useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

interface Department {
  id: string;
  name: string;
}

export const useDepartmentOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const { roleType } = useAppSelector(authState);
  const skipFetch = useMemo(() => roleType === 'CLUB', [roleType]);

  useEffect(() => {
    let isMounted = true;

    const fetchDepartments = async () => {
      if (skipFetch) {
        setOptions([]);
        return;
      }
      try {
        const response = await axiosInstance.get('cms/department-mod/departments', {
          params: {
            offset: 0,
            limit: 200
          }
        });

        if (!isMounted) return;

        const departments: Department[] = response.data?.results || [];
        const mapped = departments.map((dept) => ({
          label: dept.name,
          value: String(dept.id)
        }));

        setOptions(mapped);
      } catch (error) {
        console.error('Failed to load departments', error);
      }
    };

    fetchDepartments();

    return () => {
      isMounted = false;
    };
  }, [skipFetch]);

  return {
    options
  };
};
