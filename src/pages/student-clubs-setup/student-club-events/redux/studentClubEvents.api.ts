import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import {
  IStudentClubEventsCreatePayload,
  IStudentClubEventsDetails,
  IStudentClubEventsList,
  IStudentClubEventsUpdatePayload
} from './types';
import { formatReadableDatetime } from '@/utils/functions/date';

export const studentClubEventsAPI = 'cms/website-mod/student-club-events';

export const studentClubEventsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get StudentClubEvents
    getStudentClubEvents: builder.query<IStudentClubEventsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params

        // Update startYear and endYear in place with parsed years
        const updatedItems = filterModel
          ? filterModel.items.map((item) => {
              if (item.field === 'date') {
                return {
                  ...item,
                  value: formatReadableDatetime(item.value, 'MM/DD/YYYY')
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
          url: `${studentClubEventsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['StudentClubEvents']
    }),

    // Retrieve StudentClubEvents
    retrieveStudentClubEvents: builder.query<IStudentClubEventsDetails, number | null>({
      query: (id) => {
        return {
          url: `${studentClubEventsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['StudentClubEvents']
    }),

    // Create StudentClubEvents
    createStudentClubEvents: builder.mutation<IMutationSuccessResponse, IStudentClubEventsCreatePayload>({
      query: (values) => {
        const { thumbnail, gallery, date, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (date) {
          body.append('date', formatReadableDatetime(date, 'YYYY-MM-DD'));
        }

        // Append thumbnail if it's a File
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        // Append gallery images if they are provided
        if (gallery && gallery.length > 0) {
          gallery.forEach((item, index) => {
            if (!item.image) return; // skip if image is not provided

            if (item.image instanceof File) {
              body.append(`gallery[${index}][image]`, item.image);
            }
            if (item.caption) {
              body.append(`gallery[${index}][caption]`, item.caption);
            }
            if (item.isActive !== undefined) {
              body.append(`gallery[${index}][isActive]`, String(item.isActive));
            }
          });
        }

        return {
          url: `${studentClubEventsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['StudentClubEvents']
    }),

    // Patch StudentClubEvents
    patchStudentClubEvents: builder.mutation<IMutationSuccessResponse, { id: number; values: IStudentClubEventsUpdatePayload }>({
      query: ({ id, values }) => {
        const { thumbnail, gallery, date, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (date) {
          body.append('date', formatReadableDatetime(date, 'YYYY-MM-DD'));
        }

        // Append thumbnail if it's a File
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        // Append gallery images if they are provided
        if (gallery && gallery.length > 0) {
          gallery.forEach((item, index) => {
            if (!item.image) return; // skip if image is not provided

            if (item.image instanceof File) {
              body.append(`gallery[${index}][image]`, item.image);
            }
            if (item.id !== undefined) {
              body.append(`gallery[${index}][id]`, String(item.id));
            }
            if (item.caption) {
              body.append(`gallery[${index}][caption]`, item.caption);
            }
            if (item.isActive !== undefined) {
              body.append(`gallery[${index}][isActive]`, String(item.isActive));
            }
          });
        }

        return {
          url: `${studentClubEventsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['StudentClubEvents']
    }),

    // Delete StudentClubEvents
    deleteStudentClubEvents: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => {
        return {
          url: `${studentClubEventsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['StudentClubEvents']
    }),
    deletStudentClubEventsgallery: builder.mutation<IMutationSuccessResponse, { id: number; gallery_id: number }>({
      query: ({ id, gallery_id }) => {
        return {
          url: `${studentClubEventsAPI}/${id}/gallery/${gallery_id}`,
          method: 'DELETE'
        };
      }
      // invalidatesTags: ['StudentClubEvents']
    })
  })
});

export const {
  useGetStudentClubEventsQuery,
  useLazyGetStudentClubEventsQuery,
  useRetrieveStudentClubEventsQuery,
  useLazyRetrieveStudentClubEventsQuery,
  useCreateStudentClubEventsMutation,
  usePatchStudentClubEventsMutation,
  useDeleteStudentClubEventsMutation,
  useDeletStudentClubEventsgalleryMutation
} = studentClubEventsAPISlice;
