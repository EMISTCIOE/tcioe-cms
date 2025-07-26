import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  ICampusKeyOfficialsList,
  ICampusKeyOfficialsDetails,
  ICampusKeyOfficialsCreatePayload,
  ICampusKeyOfficialsUpdatePayload
} from './types';

export const campusKeyOfficialsAPI = 'cms/website-mod/campus-key-officials';

export const campusKeyOfficialsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusKeyOfficialss
    getCampusKeyOfficials: builder.query<ICampusKeyOfficialsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusKeyOfficialsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusKeyOfficials']
    }),

    // Retrieve CampusKeyOfficials
    retrieveCampusKeyOfficials: builder.query<ICampusKeyOfficialsDetails, number | null>({
      query: (id) => {
        return {
          url: `${campusKeyOfficialsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusKeyOfficials']
    }),

    // Create CampusKeyOfficials
    createCampusKeyOfficials: builder.mutation<IMutationSuccessResponse, ICampusKeyOfficialsCreatePayload>({
      query: (values) => {
        const { photo, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append photo if it's a File
        if (photo instanceof File) {
          body.append('photo', photo);
        }

        return {
          url: `${campusKeyOfficialsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['CampusKeyOfficials']
    }),

    // Patch CampusKeyOfficials
    patchCampusKeyOfficials: builder.mutation<IMutationSuccessResponse, { id: number; values: ICampusKeyOfficialsUpdatePayload }>({
      query: ({ id, values }) => {
        const { photo, ...rest } = values;

        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append photo if it's a File
        if (photo instanceof File) {
          body.append('photo', photo);
        }

        return {
          url: `${campusKeyOfficialsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusKeyOfficials']
    }),

    // Delete CampusKeyOfficials
    deleteCampusKeyOfficials: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => {
        return {
          url: `${campusKeyOfficialsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusKeyOfficials']
    })
  })
});

export const {
  useGetCampusKeyOfficialsQuery,
  useLazyGetCampusKeyOfficialsQuery,
  useRetrieveCampusKeyOfficialsQuery,
  useLazyRetrieveCampusKeyOfficialsQuery,
  useCreateCampusKeyOfficialsMutation,
  usePatchCampusKeyOfficialsMutation,
  useDeleteCampusKeyOfficialsMutation
} = campusKeyOfficialsAPISlice;
