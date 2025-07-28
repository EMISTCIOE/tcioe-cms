import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { formatReadableDatetime } from '@/utils/functions/date';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { ICampusEventsCreatePayload, ICampusEventsDetails, ICampusEventsList, ICampusEventsUpdatePayload } from './types';

export const campusEventsAPI = 'cms/website-mod/campus-events';

export const campusEventsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusEvents
    getCampusEvents: builder.query<ICampusEventsList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusEventsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusEvents']
    }),

    // Retrieve CampusEvents
    retrieveCampusEvents: builder.query<ICampusEventsDetails, number | null>({
      query: (id) => {
        return {
          url: `${campusEventsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusEvents']
    }),

    // Create CampusEvents
    createCampusEvents: builder.mutation<IMutationSuccessResponse, ICampusEventsCreatePayload>({
      query: (values) => {
        const { thumbnail, gallery, eventStartDate, eventEndDate, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (eventStartDate) {
          body.append('eventStartDate', formatReadableDatetime(eventStartDate, 'YYYY-MM-DD'));
        }
        if (eventEndDate) {
          body.append('eventEndDate', formatReadableDatetime(eventEndDate, 'YYYY-MM-DD'));
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
          url: `${campusEventsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['CampusEvents']
    }),

    // Patch CampusEvents
    patchCampusEvents: builder.mutation<IMutationSuccessResponse, { id: number; values: ICampusEventsUpdatePayload }>({
      query: ({ id, values }) => {
        const { thumbnail, gallery, eventStartDate, eventEndDate, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (eventStartDate) {
          body.append('eventStartDate', formatReadableDatetime(eventStartDate, 'YYYY-MM-DD'));
        }
        if (eventEndDate) {
          body.append('eventEndDate', formatReadableDatetime(eventEndDate, 'YYYY-MM-DD'));
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
          url: `${campusEventsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['CampusEvents']
    }),

    // Delete CampusEvents
    deleteCampusEvents: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => {
        return {
          url: `${campusEventsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['CampusEvents']
    }),
    deletCampusEventsgallery: builder.mutation<IMutationSuccessResponse, { id: number; gallery_id: number }>({
      query: ({ id, gallery_id }) => {
        return {
          url: `${campusEventsAPI}/${id}/gallery/${gallery_id}`,
          method: 'DELETE'
        };
      }
      // invalidatesTags: ['CampusEvents']
    })
  })
});

export const {
  useGetCampusEventsQuery,
  useLazyGetCampusEventsQuery,
  useRetrieveCampusEventsQuery,
  useLazyRetrieveCampusEventsQuery,
  useCreateCampusEventsMutation,
  usePatchCampusEventsMutation,
  useDeleteCampusEventsMutation,
  useDeletCampusEventsgalleryMutation
} = campusEventsAPISlice;
