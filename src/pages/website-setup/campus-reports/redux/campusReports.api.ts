import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  ICampusReportsList,
  ICampusReportsDetails,
  ICampusReportsCreatePayload,
  ICampusReportsUpdatePayload,
  IFiscalSession,
  IFiscalSessionsList
} from './types';
import { formatReadableDatetime } from '@/utils/functions/date';

export const campusReportsAPI = 'cms/website-mod/campus-reports';

export const campusReportsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusReports
    getCampusReports: builder.query<ICampusReportsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusReportsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusReports']
    }),

    // Retrieve CampusReports
    retrieveCampusReports: builder.query<ICampusReportsDetails, string | null>({
      query: (id) => {
        return {
          url: `${campusReportsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusReports']
    }),

    // Create CampusReports
    createCampusReports: builder.mutation<IMutationSuccessResponse, ICampusReportsCreatePayload>({
      query: (values) => {
        const { file, publishedDate, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (publishedDate) {
          body.append('publishedDate', formatReadableDatetime(String(publishedDate), 'YYYY-MM-DD'));
        }

        // Append file if it's a File
        if (file instanceof File) {
          body.append('file', file);
        }

        return {
          url: `${campusReportsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['CampusReports']
    }),

    // Patch CampusReports
    patchCampusReports: builder.mutation<IMutationSuccessResponse, { id: string; values: ICampusReportsUpdatePayload }>({
      query: ({ id, values }) => {
        const { file, publishedDate, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (publishedDate) {
          body.append('publishedDate', formatReadableDatetime(String(publishedDate), 'YYYY-MM-DD'));
        }

        // Append file if it's a File
        if (file instanceof File) {
          body.append('file', file);
        }

        return {
          url: `${campusReportsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusReports']
    }),

    // Delete CampusReports
    deleteCampusReports: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => {
        return {
          url: `${campusReportsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusReports']
    }),

    getFiscalSessions: builder.query<IFiscalSessionsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusReportsAPI}/fiscal-sessions?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      }
    })
  })
});

export const {
  useGetCampusReportsQuery,
  useLazyGetCampusReportsQuery,
  useRetrieveCampusReportsQuery,
  useLazyRetrieveCampusReportsQuery,
  useCreateCampusReportsMutation,
  usePatchCampusReportsMutation,
  useDeleteCampusReportsMutation,
  useGetFiscalSessionsQuery
} = campusReportsAPISlice;
