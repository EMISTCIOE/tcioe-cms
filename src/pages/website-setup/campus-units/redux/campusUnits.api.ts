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
    retrieveCampusUnits: builder.query<ICampusUnitsDetails, number | null>({
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
        const { members, thumbnail, heroImage, ...rest } = values;
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
            if (member.titlePrefix) {
              body.append(`members[${index}][titlePrefix]`, member.titlePrefix);
            }
            if (member.fullName) {
              body.append(`members[${index}][fullName]`, member.fullName);
            }
            if (member.designation) {
              body.append(`members[${index}][designation]`, member.designation);
            }
            if (member.email) {
              body.append(`members[${index}][email]`, member.email);
            }
            if (member.phoneNumber) {
              body.append(`members[${index}][phoneNumber]`, member.phoneNumber);
            }
            if (member.bio) {
              body.append(`members[${index}][bio]`, member.bio);
            }
            if (member.displayOrder !== undefined) {
              body.append(`members[${index}][displayOrder]`, String(member.displayOrder));
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
    patchCampusUnits: builder.mutation<IMutationSuccessResponse, { id: number; values: ICampusUnitsUpdatePayload }>({
      query: ({ id, values }) => {
        const { members, thumbnail, heroImage, ...rest } = values;
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
            if (member.titlePrefix) {
              body.append(`members[${index}][titlePrefix]`, member.titlePrefix);
            }
            if (member.email) {
              body.append(`members[${index}][email]`, member.email);
            }
            if (member.phoneNumber) {
              body.append(`members[${index}][phoneNumber]`, member.phoneNumber);
            }
            if (member.bio) {
              body.append(`members[${index}][bio]`, member.bio);
            }
            if (member.displayOrder !== undefined) {
              body.append(`members[${index}][displayOrder]`, String(member.displayOrder));
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
    deleteCampusUnits: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => {
        return {
          url: `${campusUnitsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusUnits']
    }),
    deletCampusUnitsMember: builder.mutation<IMutationSuccessResponse, { id: number; member_id: number }>({
      query: ({ id, member_id }) => {
        return {
          url: `${campusUnitsAPI}/${id}/member/${member_id}`,
          method: 'DELETE'
        };
      }
      // invalidatesTags: ['CampusUnits']
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
  useDeleteCampusUnitsMutation,
  useDeletCampusUnitsMemberMutation
} = campusUnitsAPISlice;
