import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  IAcademicCalendarsList,
  IAcademicCalendarsDetails,
  IAcademicCalendarsCreatePayload,
  IAcademicCalendarsUpdatePayload
} from './types';
import { parseToYear } from '@/utils/functions/date';
import { GridFilterModel } from '@mui/x-data-grid';

export const academicCalendarsAPI = 'cms/website-mod/academic-calendars';

export const academicCalendarsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get AcademicCalendars
    getAcademicCalendars: builder.query<IAcademicCalendarsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params

        // Update startYear and endYear in place with parsed years
        const updatedItems = filterModel
          ? filterModel.items.map((item) => {
              if (item.field === 'startYear' || item.field === 'endYear') {
                return {
                  ...item,
                  value: parseToYear(item.value)
                };
              }
              return item;
            })
          : [];

        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel: {
            ...filterModel,
            items: updatedItems
          }
        });

        return {
          url: `${academicCalendarsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['AcademicCalendars']
    }),

    // Retrieve AcademicCalendars
    retrieveAcademicCalendars: builder.query<IAcademicCalendarsDetails, number | null>({
      query: (id) => {
        return {
          url: `${academicCalendarsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['AcademicCalendars']
    }),

    // Create AcademicCalendars
    createAcademicCalendars: builder.mutation<IMutationSuccessResponse, IAcademicCalendarsCreatePayload>({
      query: (values) => {
        const { file, startYear, endYear, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Convert startYear and endYear to integers if they are strings | numbers | dates
        body.append('startYear', String(parseToYear(startYear)));
        body.append('endYear', String(parseToYear(endYear)));

        // Append file if it's a File
        if (file instanceof File) {
          body.append('file', file);
        }

        return {
          url: `${academicCalendarsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['AcademicCalendars']
    }),

    // Patch AcademicCalendars
    patchAcademicCalendars: builder.mutation<IMutationSuccessResponse, { id: number; values: IAcademicCalendarsUpdatePayload }>({
      query: ({ id, values }) => {
        const { file, startYear, endYear, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Convert startYear and endYear to integers if they are strings | numbers | dates
        body.append('startYear', String(parseToYear(startYear)));
        body.append('endYear', String(parseToYear(endYear)));

        // Append file if it's a File
        if (file instanceof File) {
          body.append('file', file);
        }

        return {
          url: `${academicCalendarsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['AcademicCalendars']
    }),

    // Delete AcademicCalendars
    deleteAcademicCalendars: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => {
        return {
          url: `${academicCalendarsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['AcademicCalendars']
    })
  })
});

export const {
  useGetAcademicCalendarsQuery,
  useLazyGetAcademicCalendarsQuery,
  useRetrieveAcademicCalendarsQuery,
  useLazyRetrieveAcademicCalendarsQuery,
  useCreateAcademicCalendarsMutation,
  usePatchAcademicCalendarsMutation,
  useDeleteAcademicCalendarsMutation
} = academicCalendarsAPISlice;
