import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { formatReadableDatetime } from '@/utils/functions/date';
import { IGlobalEventsCreatePayload, IGlobalEventsDetails, IGlobalEventsList, IGlobalEventsUpdatePayload } from './globalEvents.types';

export const globalEventsAPI = 'cms/website-mod/global-events';

export const globalEventsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalEvents: builder.query<IGlobalEventsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${globalEventsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      providesTags: ['GlobalEvents'],
      keepUnusedDataFor: 0.1
    }),

    retrieveGlobalEvents: builder.query<IGlobalEventsDetails, string | null>({
      query: (id) => ({
        url: `${globalEventsAPI}/${id}`,
        method: 'GET'
      }),
      providesTags: ['GlobalEvents'],
      keepUnusedDataFor: 0.1
    }),

    createGlobalEvents: builder.mutation<IMutationSuccessResponse, IGlobalEventsCreatePayload>({
      query: (values) => {
        const { unions, clubs, departments, thumbnail, eventStartDate, eventEndDate, ...rest } = values;
        const body = new FormData();
        const snakeMap: Record<string, string> = {
          isActive: 'is_active',
          isApprovedByDepartment: 'is_approved_by_department',
          isApprovedByCampus: 'is_approved_by_campus',
          registrationLink: 'registration_link',
          eventType: 'event_type'
        };

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const snakeKey = snakeMap[key] ?? key;
            body.append(snakeKey, value as string);
          }
        });

        if (eventStartDate) {
          body.append('event_start_date', formatReadableDatetime(eventStartDate, 'YYYY-MM-DD'));
        }
        if (eventEndDate) {
          body.append('event_end_date', formatReadableDatetime(eventEndDate, 'YYYY-MM-DD'));
        }

        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        unions?.forEach((union) => body.append('unions', String(union)));
        clubs?.forEach((club) => body.append('clubs', String(club)));
        departments?.forEach((department) => body.append('departments', String(department)));

        return {
          url: `${globalEventsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['GlobalEvents']
    }),

    patchGlobalEvents: builder.mutation<IMutationSuccessResponse, { id: string; values: IGlobalEventsUpdatePayload }>({
      query: ({ id, values }) => {
        const { unions, clubs, departments, thumbnail, eventStartDate, eventEndDate, ...rest } = values;
        const body = new FormData();
        const snakeMap: Record<string, string> = {
          isActive: 'is_active',
          isApprovedByDepartment: 'is_approved_by_department',
          isApprovedByCampus: 'is_approved_by_campus',
          registrationLink: 'registration_link',
          eventType: 'event_type'
        };

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            const snakeKey = snakeMap[key] ?? key;
            body.append(snakeKey, value as string);
          }
        });

        if (eventStartDate) {
          body.append('event_start_date', formatReadableDatetime(eventStartDate, 'YYYY-MM-DD'));
        }
        if (eventEndDate) {
          body.append('event_end_date', formatReadableDatetime(eventEndDate, 'YYYY-MM-DD'));
        }

        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        } else if (thumbnail === '') {
          body.append('thumbnail', '');
        }

        if (unions) {
          unions.forEach((union) => body.append('unions', String(union)));
        }
        if (clubs) {
          clubs.forEach((club) => body.append('clubs', String(club)));
        }
        if (departments) {
          departments.forEach((department) => body.append('departments', String(department)));
        }

        return {
          url: `${globalEventsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['GlobalEvents']
    }),

    deleteGlobalEvents: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => ({
        url: `${globalEventsAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['GlobalEvents']
    })
  })
});

export const {
  useGetGlobalEventsQuery,
  useLazyGetGlobalEventsQuery,
  useRetrieveGlobalEventsQuery,
  useLazyRetrieveGlobalEventsQuery,
  useCreateGlobalEventsMutation,
  usePatchGlobalEventsMutation,
  useDeleteGlobalEventsMutation
} = globalEventsAPISlice;
