import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { ICampusUnionsCreatePayload, ICampusUnionsDetails, ICampusUnionsList, ICampusUnionsUpdatePayload } from './types';

export const campusUnionsAPI = 'cms/website-mod/campus-unions';

export const campusUnionsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusUnions
    getCampusUnions: builder.query<ICampusUnionsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusUnionsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusUnions']
    }),

    // Retrieve CampusUnions
    retrieveCampusUnions: builder.query<ICampusUnionsDetails, string | null>({
      query: (id) => {
        return {
          url: `${campusUnionsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusUnions']
    }),

    // Create CampusUnions
    createCampusUnions: builder.mutation<IMutationSuccessResponse, ICampusUnionsCreatePayload>({
      query: (values) => {
        const { members, thumbnail, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append members
        if (members && members.length > 0) {
          members.forEach((member, index) => {
            if (member.photo instanceof File) {
              body.append(`members[${index}][photo]`, member.photo);
            }
            if (member.fullName) {
              body.append(`members[${index}][fullName]`, member.fullName);
            }
            if (member.designation) {
              body.append(`members[${index}][designation]`, member.designation);
            }
            if (member.isActive !== undefined) {
              body.append(`members[${index}][isActive]`, String(member.isActive));
            }
          });
        }

        // Append thumbnail if it exists
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        return {
          url: `${campusUnionsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['CampusUnions']
    }),

    // Patch CampusUnions
    patchCampusUnions: builder.mutation<IMutationSuccessResponse, { id: string; values: ICampusUnionsUpdatePayload }>({
      query: ({ id, values }) => {
        const { members, thumbnail, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append members
        if (members && members.length > 0) {
          members.forEach((member, index) => {
            if (member.photo instanceof File) {
              body.append(`members[${index}][photo]`, member.photo);
            }
            if (member.id !== undefined) {
              body.append(`members[${index}][id]`, String(member.id));
            }
            if (member.fullName) {
              body.append(`members[${index}][fullName]`, member.fullName);
            }
            if (member.designation) {
              body.append(`members[${index}][designation]`, member.designation);
            }
            if (member.isActive !== undefined) {
              body.append(`members[${index}][isActive]`, String(member.isActive));
            }
          });
        }

        // Append thumbnail if it exists
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        return {
          url: `${campusUnionsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusUnions']
    }),

    // Delete CampusUnions
    deleteCampusUnions: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => {
        return {
          url: `${campusUnionsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusUnions']
    }),
    deletCampusUnionsMember: builder.mutation<IMutationSuccessResponse, { id: string; member_id: string }>({
      query: ({ id, member_id }) => {
        return {
          url: `${campusUnionsAPI}/${id}/member/${member_id}`,
          method: 'DELETE'
        };
      }
      // invalidatesTags: ['CampusUnions']
    })
  })
});

export const {
  useGetCampusUnionsQuery,
  useLazyGetCampusUnionsQuery,
  useRetrieveCampusUnionsQuery,
  useLazyRetrieveCampusUnionsQuery,
  useCreateCampusUnionsMutation,
  usePatchCampusUnionsMutation,
  useDeleteCampusUnionsMutation,
  useDeletCampusUnionsMemberMutation
} = campusUnionsAPISlice;
