import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  IAcademicDownloadsList,
  IAcademicDownloadsDetails,
  IAcademicDownloadsCreatePayload,
  IAcademicDownloadsUpdatePayload
} from './types';

export const academicDownloadsAPI = 'cms/department-mod/department-downloads';

export const academicDownloadsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get AcademicDownloadss
    getAcademicDownloads: builder.query<IAcademicDownloadsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${academicDownloadsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['AcademicDownloads']
    }),

    // Retrieve AcademicDownloads
    retrieveAcademicDownloads: builder.query<IAcademicDownloadsDetails, string | null>({
      query: (id) => {
        return {
          url: `${academicDownloadsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['AcademicDownloads']
    }),

    // Create AcademicDownloads
    createAcademicDownloads: builder.mutation<IMutationSuccessResponse, IAcademicDownloadsCreatePayload>({
      query: (values) => {
        const { file, isActive, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Create endpoint does not accept is_active explicitly; rely on backend default

        // Append file if it's a File
        if (file instanceof File) {
          body.append('file', file);
        }

        return {
          url: `${academicDownloadsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['AcademicDownloads']
    }),

    // Patch AcademicDownloads
    patchAcademicDownloads: builder.mutation<IMutationSuccessResponse, { id: string; values: IAcademicDownloadsUpdatePayload }>({
      query: ({ id, values }) => {
        const { file, isActive, ...rest } = values;

        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (isActive !== undefined && isActive !== null) {
          body.append('is_active', String(isActive));
        }

        // Append file if it's a File
        if (file instanceof File) {
          body.append('file', file);
        }

        return {
          url: `${academicDownloadsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['AcademicDownloads']
    }),

    // Delete AcademicDownloads
    deleteAcademicDownloads: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => {
        return {
          url: `${academicDownloadsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['AcademicDownloads']
    })
  })
});

export const {
  useGetAcademicDownloadsQuery,
  useLazyGetAcademicDownloadsQuery,
  useRetrieveAcademicDownloadsQuery,
  useLazyRetrieveAcademicDownloadsQuery,
  useCreateAcademicDownloadsMutation,
  usePatchAcademicDownloadsMutation,
  useDeleteAcademicDownloadsMutation
} = academicDownloadsAPISlice;
