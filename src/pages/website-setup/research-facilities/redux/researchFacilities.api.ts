import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  IResearchFacilityCreatePayload,
  IResearchFacilityDetails,
  IResearchFacilityUpdatePayload,
  IResearchFacilitiesList
} from './types';

export const researchFacilitiesAPI = 'cms/website-mod/research-facilities';

export const researchFacilitiesAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getResearchFacilities: builder.query<IResearchFacilitiesList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });
        return {
          url: `${researchFacilitiesAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['ResearchFacilities']
    }),

    retrieveResearchFacility: builder.query<IResearchFacilityDetails, number | null>({
      query: (id) => ({
        url: `${researchFacilitiesAPI}/${id}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 0.1,
      providesTags: ['ResearchFacilities']
    }),

    createResearchFacility: builder.mutation<IMutationSuccessResponse, IResearchFacilityCreatePayload>({
      query: (values) => {
        const { thumbnail, ...rest } = values;
        const body = new FormData();

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        });

        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        return {
          url: researchFacilitiesAPI,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['ResearchFacilities']
    }),

    patchResearchFacility: builder.mutation<IMutationSuccessResponse, { id: number; values: IResearchFacilityUpdatePayload }>({
      query: ({ id, values }) => {
        const { thumbnail, ...rest } = values;
        const body = new FormData();

        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        });

        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        return {
          url: `${researchFacilitiesAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['ResearchFacilities']
    }),

    deleteResearchFacility: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => ({
        url: `${researchFacilitiesAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['ResearchFacilities']
    })
  })
});

export const {
  useGetResearchFacilitiesQuery,
  useLazyGetResearchFacilitiesQuery,
  useRetrieveResearchFacilityQuery,
  useLazyRetrieveResearchFacilityQuery,
  useCreateResearchFacilityMutation,
  usePatchResearchFacilityMutation,
  useDeleteResearchFacilityMutation
} = researchFacilitiesAPISlice;
