import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { ICampusSectionsCreatePayload, ICampusSectionsDetails, ICampusSectionsList, ICampusSectionsUpdatePayload } from './types';

export const campusSectionsAPI = 'cms/website-mod/campus-sections';

export const campusSectionsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusSections
    getCampusSections: builder.query<ICampusSectionsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusSectionsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusSections']
    }),

    // Retrieve CampusSections
    retrieveCampusSections: builder.query<ICampusSectionsDetails, number | null>({
      query: (id) => {
        return {
          url: `${campusSectionsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusSections']
    }),

    // Create CampusSections
    createCampusSections: builder.mutation<IMutationSuccessResponse, ICampusSectionsCreatePayload>({
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
          url: `${campusSectionsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['CampusSections']
    }),

    // Patch CampusSections
    patchCampusSections: builder.mutation<IMutationSuccessResponse, { id: number; values: ICampusSectionsUpdatePayload }>({
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
          url: `${campusSectionsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusSections']
    }),

    // Delete CampusSections
    deleteCampusSections: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => {
        return {
          url: `${campusSectionsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusSections']
    })
  })
});

export const {
  useGetCampusSectionsQuery,
  useLazyGetCampusSectionsQuery,
  useRetrieveCampusSectionsQuery,
  useLazyRetrieveCampusSectionsQuery,
  useCreateCampusSectionsMutation,
  usePatchCampusSectionsMutation,
  useDeleteCampusSectionsMutation
} = campusSectionsAPISlice;
