import { IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import {
  IAcademicProgramCreatePayload,
  IAcademicProgramFilters,
  IAcademicProgramListResponse,
  IAcademicProgramUpdatePayload,
  ISubjectCreatePayload,
  ISubjectFilters,
  ISubjectListResponse,
  ISubjectUpdatePayload
} from '../types';

const academicProgramsAPI = 'cms/department-mod/academic-programs';
const subjectsAPI = 'cms/curriculum-mod/subjects';

const buildQueryString = (params: Record<string, any>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

export const academicAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAcademicPrograms: builder.query<IAcademicProgramListResponse, IAcademicProgramFilters>({
      query: ({ limit, offset, search, department }) => {
        const queryString = buildQueryString({ limit, offset, search, department });
        return {
          url: `${academicProgramsAPI}${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        };
      },
      transformResponse: (response: any) => {
        const results =
          response?.results?.map((item: any) => ({
            ...item,
            short_name: item.short_name ?? item.shortName ?? '',
            program_type: item.program_type ?? item.programType ?? '',
            is_active: item.is_active ?? item.isActive ?? false,
            department: item.department
              ? {
                  ...item.department,
                  short_name: item.department.short_name ?? item.department.shortName
                }
              : item.department
          })) ?? [];

        return {
          ...response,
          results
        } as IAcademicProgramListResponse;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map((program) => ({ type: 'AcademicProgram' as const, id: program.id })),
              { type: 'AcademicProgram', id: 'LIST' }
            ]
          : [{ type: 'AcademicProgram', id: 'LIST' }]
    }),

    createAcademicProgram: builder.mutation<IMutationSuccessResponse, IAcademicProgramCreatePayload>({
      query: (payload) => {
        const body = new FormData();

        // Handle each field specifically to ensure proper formatting
        body.append('name', payload.name.trim());
        if (payload.short_name && payload.short_name.trim()) {
          body.append('short_name', payload.short_name.trim());
        }
        body.append('description', payload.description || '');
        body.append('program_type', payload.program_type);
        body.append('department', String(payload.department));

        if (payload.thumbnail && payload.thumbnail instanceof File) {
          body.append('thumbnail', payload.thumbnail);
        }

        return {
          url: academicProgramsAPI,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: [{ type: 'AcademicProgram', id: 'LIST' }]
    }),

    updateAcademicProgram: builder.mutation<IMutationSuccessResponse, IAcademicProgramUpdatePayload>({
      query: ({ id, ...rest }) => {
        const body = new FormData();
        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        });

        return {
          url: `${academicProgramsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'AcademicProgram', id },
        { type: 'AcademicProgram', id: 'LIST' }
      ]
    }),

    deleteAcademicProgram: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => ({
        url: `${academicProgramsAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AcademicProgram', id },
        { type: 'AcademicProgram', id: 'LIST' }
      ]
    }),

    getSubjects: builder.query<ISubjectListResponse, ISubjectFilters>({
      query: ({ limit, offset, search, program, academic_program_id }) => {
        const queryString = buildQueryString({ limit, offset, search, program, academic_program_id });
        return {
          url: `${subjectsAPI}${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        };
      },
      providesTags: (result) =>
        result
          ? [...result.results.map((subject) => ({ type: 'Subject' as const, id: subject.id })), { type: 'Subject', id: 'LIST' }]
          : [{ type: 'Subject', id: 'LIST' }]
    }),

    createSubject: builder.mutation<IMutationSuccessResponse, ISubjectCreatePayload>({
      query: (payload) => ({
        url: subjectsAPI,
        method: 'POST',
        data: payload
      }),
      invalidatesTags: [{ type: 'Subject', id: 'LIST' }]
    }),

    updateSubject: builder.mutation<IMutationSuccessResponse, ISubjectUpdatePayload>({
      query: ({ id, ...rest }) => ({
        url: `${subjectsAPI}/${id}`,
        method: 'PATCH',
        data: rest
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Subject', id },
        { type: 'Subject', id: 'LIST' }
      ]
    }),

    deleteSubject: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => ({
        url: `${subjectsAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Subject', id },
        { type: 'Subject', id: 'LIST' }
      ]
    })
  })
});

export const {
  useGetAcademicProgramsQuery,
  useCreateAcademicProgramMutation,
  useUpdateAcademicProgramMutation,
  useDeleteAcademicProgramMutation,
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation
} = academicAPISlice;
