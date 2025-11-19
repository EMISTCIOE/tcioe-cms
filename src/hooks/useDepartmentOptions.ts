import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';

interface Department {
  id: string;
  name: string;
}

export const useDepartmentOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDepartments = async () => {
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
          value: dept.id
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
  }, []);

  return {
    options
  };
};
