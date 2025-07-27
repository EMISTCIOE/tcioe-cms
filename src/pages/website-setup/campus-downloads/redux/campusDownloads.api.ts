import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  ICampusDownloadsList,
  ICampusDownloadsDetails,
  ICampusDownloadsCreatePayload,
  ICampusDownloadsUpdatePayload
} from './types';

export const campusDownloadsAPI = 'cms/website-mod/campus-downloads';

export const campusDownloadsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusDownloadss
    getCampusDownloads: builder.query<ICampusDownloadsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusDownloadsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusDownloads']
    }),

    // Retrieve CampusDownloads
    retrieveCampusDownloads: builder.query<ICampusDownloadsDetails, number | null>({
      query: (id) => {
        return {
          url: `${campusDownloadsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusDownloads']
    }),

    // Create CampusDownloads
    createCampusDownloads: builder.mutation<IMutationSuccessResponse, ICampusDownloadsCreatePayload>({
      query: (values) => {
        const { file, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append file if it's a File
        if (file instanceof File) {
          body.append('file', file);
        }

        return {
          url: `${campusDownloadsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['CampusDownloads']
    }),

    // Patch CampusDownloads
    patchCampusDownloads: builder.mutation<IMutationSuccessResponse, { id: number; values: ICampusDownloadsUpdatePayload }>({
      query: ({ id, values }) => {
        const { file, ...rest } = values;

        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append file if it's a File
        if (file instanceof File) {
          body.append('file', file);
        }

        return {
          url: `${campusDownloadsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusDownloads']
    }),

    // Delete CampusDownloads
    deleteCampusDownloads: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => {
        return {
          url: `${campusDownloadsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusDownloads']
    })
  })
});

export const {
  useGetCampusDownloadsQuery,
  useLazyGetCampusDownloadsQuery,
  useRetrieveCampusDownloadsQuery,
  useLazyRetrieveCampusDownloadsQuery,
  useCreateCampusDownloadsMutation,
  usePatchCampusDownloadsMutation,
  useDeleteCampusDownloadsMutation
} = campusDownloadsAPISlice;
