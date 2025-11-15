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
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        });

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

    deleteAcademicProgram: builder.mutation<IMutationSuccessResponse, number>({
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
