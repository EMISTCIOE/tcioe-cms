import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { ICampusUnitsCreatePayload, ICampusUnitsDetails, ICampusUnitsList, ICampusUnitsUpdatePayload } from './types';

export const campusUnitsAPI = 'cms/website-mod/campus-units';

export const campusUnitsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusUnits
    getCampusUnits: builder.query<ICampusUnitsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusUnitsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusUnits']
    }),

    // Retrieve CampusUnits
    retrieveCampusUnits: builder.query<ICampusUnitsDetails, string | null>({
      query: (id) => {
        return {
          url: `${campusUnitsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusUnits']
    }),

    // Create CampusUnits
    createCampusUnits: builder.mutation<IMutationSuccessResponse, ICampusUnitsCreatePayload>({
      query: (values) => {
        const { designations, members, departmentHead, thumbnail, heroImage, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (designations && designations.length > 0) {
          designations.forEach((designation, index) => body.append(`designations[${index}]`, designation));
        }
        if (members && members.length > 0) {
          members.forEach((memberId, index) => body.append(`members[${index}]`, String(memberId)));
        }
        if (departmentHead !== undefined && departmentHead !== null) {
          body.append('departmentHead', String(departmentHead));
        }

        // Append thumbnail if it exists
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }
        if (heroImage instanceof File) {
          body.append('heroImage', heroImage);
        }

        return {
          url: `${campusUnitsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['CampusUnits']
    }),

    // Patch CampusUnits
    patchCampusUnits: builder.mutation<IMutationSuccessResponse, { id: string; values: ICampusUnitsUpdatePayload }>({
      query: ({ id, values }) => {
        const { designations, members, departmentHead, thumbnail, heroImage, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (designations && designations.length > 0) {
          designations.forEach((designation, index) => body.append(`designations[${index}]`, designation));
        }
        if (members && members.length > 0) {
          members.forEach((memberId, index) => body.append(`members[${index}]`, String(memberId)));
        }
        if (departmentHead !== undefined && departmentHead !== null) {
          body.append('departmentHead', String(departmentHead));
        }

        // Append thumbnail if it exists
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }
        if (heroImage instanceof File) {
          body.append('heroImage', heroImage);
        }

        return {
          url: `${campusUnitsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusUnits']
    }),

    // Delete CampusUnits
    deleteCampusUnits: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => {
        return {
          url: `${campusUnitsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusUnits']
    })
  })
});

export const {
  useGetCampusUnitsQuery,
  useLazyGetCampusUnitsQuery,
  useRetrieveCampusUnitsQuery,
  useLazyRetrieveCampusUnitsQuery,
  useCreateCampusUnitsMutation,
  usePatchCampusUnitsMutation,
  useDeleteCampusUnitsMutation
} = campusUnitsAPISlice;
