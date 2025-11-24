import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { IStudentClubsCreatePayload, IStudentClubsDetails, IStudentClubsList, IStudentClubsUpdatePayload } from './types';

export const studentClubsAPI = 'cms/website-mod/student-clubs';

export const studentClubsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get StudentClubs
    getStudentClubs: builder.query<IStudentClubsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel, filters }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel,
          filters
        });

        const queryParts = [
          `offset=${page * pageSize}`,
          `limit=${pageSize}`,
          `search=${search ?? ''}`,
          `ordering=${orderingString}`
        ];

        if (filterString) {
          queryParts.push(filterString);
        }

        return {
          url: `${studentClubsAPI}?${queryParts.filter(Boolean).join('&')}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['StudentClubs']
    }),

    // Retrieve StudentClubs
    retrieveStudentClubs: builder.query<IStudentClubsDetails, string | null>({
      query: (id) => {
        return {
          url: `${studentClubsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['StudentClubs']
    }),

    // Create StudentClubs
    createStudentClubs: builder.mutation<IMutationSuccessResponse, IStudentClubsCreatePayload>({
      query: (values) => {
        const { members, thumbnail, department, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (department === null) {
          body.append('department', '');
        } else if (department !== undefined) {
          body.append('department', String(department));
        }

        // Append thumbnail if it's a File
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        // Append members
        if (members && members.length > 0) {
          members.forEach((member, index) => {
            if (member.photo instanceof File) {
              body.append(`members[${index}][photo]`, member.photo);
            }
            if (member.fullName) {
              body.append(`members[${index}][full_name]`, member.fullName);
            }
            if (member.designation) {
              body.append(`members[${index}][designation]`, member.designation);
            }
            if (member.isActive !== undefined) {
              body.append(`members[${index}][is_active]`, String(member.isActive));
            }
          });
        }

        return {
          url: `${studentClubsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['StudentClubs']
    }),

    // Patch StudentClubs
    patchStudentClubs: builder.mutation<IMutationSuccessResponse, { id: string; values: IStudentClubsUpdatePayload }>({
      query: ({ id, values }) => {
        const { members, thumbnail, department, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (department === null) {
          body.append('department', '');
        } else if (department !== undefined) {
          body.append('department', String(department));
        }

        // Append thumbnail if it's a File
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
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
              body.append(`members[${index}][full_name]`, member.fullName);
            }
            if (member.designation) {
              body.append(`members[${index}][designation]`, member.designation);
            }
            if (member.isActive !== undefined) {
              body.append(`members[${index}][is_active]`, String(member.isActive));
            }
          });
        }

        return {
          url: `${studentClubsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['StudentClubs']
    }),

    // Delete StudentClubs
    deleteStudentClubs: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => {
        return {
          url: `${studentClubsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['StudentClubs']
    }),
    deletStudentClubsMember: builder.mutation<IMutationSuccessResponse, { id: string; member_id: string }>({
      query: ({ id, member_id }) => {
        return {
          url: `${studentClubsAPI}/${id}/member/${member_id}`,
          method: 'DELETE'
        };
      }
      // invalidatesTags: ['StudentClubs']
    })
  })
});

export const {
  useGetStudentClubsQuery,
  useLazyGetStudentClubsQuery,
  useRetrieveStudentClubsQuery,
  useLazyRetrieveStudentClubsQuery,
  useCreateStudentClubsMutation,
  usePatchStudentClubsMutation,
  useDeleteStudentClubsMutation,
  useDeletStudentClubsMemberMutation
} = studentClubsAPISlice;
