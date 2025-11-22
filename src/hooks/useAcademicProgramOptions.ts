import { useEffect, useState } from 'react';
import { axiosInstance } from '@/libs/axios';
import { SelectOption } from '@/components/app-form/types';
import { useAppSelector } from '@/libs/hooks';
import { authState } from '@/pages/authentication/redux/selector';

interface AcademicProgramFetch {
  id: string;
  name: string;
  short_name?: string | null;
}

export const useAcademicProgramOptions = () => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const { roleType, departmentId } = useAppSelector(authState);

  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      try {
        const params: any = { offset: 0, limit: 200 };
        if (roleType === 'DEPARTMENT-ADMIN' && departmentId) {
          params.department = departmentId;
        }

        const response = await axiosInstance.get('cms/department-mod/academic-programs', {
          params
        });

        if (!isMounted) return;

        const programs: AcademicProgramFetch[] = response.data?.results || [];
        const mapped = programs.map((program) => ({
          label: program.short_name ? `${program.short_name} - ${program.name}` : program.name,
          value: program.id
        }));

        setOptions(mapped);
      } catch (error) {
        console.error('Failed to load academic programs', error);
      }
    };

    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  return { options };
};
