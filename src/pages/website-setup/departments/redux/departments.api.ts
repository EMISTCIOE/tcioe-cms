import { rootAPI } from '@/libs/apiSlice';
import { IListQueryParams } from '@/globals';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { IDepartment, IDepartmentCreatePayload, IDepartmentList, IDepartmentUpdatePayload } from './types';

const departmentAPI = 'cms/department-mod/departments';

export const departmentApi = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Get all departments
    getDepartments: builder.query<IDepartmentList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${departmentAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['Departments']
    }),

    // Get department by ID
    getDepartmentById: builder.query<IDepartment, string | null>({
      query: (id) => ({
        url: `${departmentAPI}/${id}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 0.1,
      providesTags: ['Departments']
    }),

    // Create department
    createDepartment: builder.mutation<{ message: string }, IDepartmentCreatePayload>({
      query: (values) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (key === 'thumbnail' && value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'boolean') {
              formData.append(key, value.toString());
            } else {
              formData.append(key, value as string);
            }
          }
        });

        return {
          url: departmentAPI,
          method: 'POST',
          body: formData
        };
      },
      invalidatesTags: ['Departments']
    }),

    // Update department
    patchDepartment: builder.mutation<{ message: string }, { id: string; values: IDepartmentUpdatePayload }>({
      query: ({ id, values }) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (key === 'thumbnail' && value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === 'boolean') {
              formData.append(key, value.toString());
            } else {
              formData.append(key, value as string);
            }
          }
        });

        return {
          url: `${departmentAPI}/${id}`,
          method: 'PATCH',
          body: formData
        };
      },
      invalidatesTags: ['Departments']
    }),

    // Delete department (soft delete - set is_archived=true)
    deleteDepartment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `${departmentAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Departments']
    })
  })
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  usePatchDepartmentMutation,
  useDeleteDepartmentMutation
} = departmentApi;
