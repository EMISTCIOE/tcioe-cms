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
  const { roleType, departmentId, departmentName } = useAppSelector(authState);
  const skipFetch = useMemo(() => roleType === 'CLUB', [roleType]);
  const lockedDepartment = useMemo(() => {
    if (roleType === 'CLUB' && departmentId) {
      return [
        {
          label: departmentName || 'My Department',
          value: String(departmentId)
        }
      ];
    }
    return [];
  }, [roleType, departmentId, departmentName]);

  // Initialize with locked department for club users to avoid empty options during first render
  const [options, setOptions] = useState<SelectOption[]>(lockedDepartment);

  useEffect(() => {
    let isMounted = true;

    const fetchDepartments = async () => {
      if (skipFetch) {
        setOptions(lockedDepartment);
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
  }, [skipFetch, departmentId, departmentName, lockedDepartment]);

  return {
    options
  };
};
