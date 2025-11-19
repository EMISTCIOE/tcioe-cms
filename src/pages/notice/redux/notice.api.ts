import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  INoticeList,
  INoticeDetails,
  INoticeCreatePayload,
  INoticeUpdatePayload,
  INoticeAuthorListResponse,
  INoticeCategoryListResponse,
  INoticeDepartmentListResponse,
  MediaType,
  NoticeStatus
} from './types';
import { GridRowId } from '@mui/x-data-grid';

export const noticeAPI = 'cms/notice-mod/notices';

export const noticeAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get Notices
    getNotices: builder.query<INoticeList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${noticeAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['Notice']
    }),

    // Retrieve Notice
    retrieveNotice: builder.query<INoticeDetails, string | null>({
      query: (id) => {
        return {
          url: `${noticeAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['Notice']
    }),

    // Create Notice
    createNotice: builder.mutation<IMutationSuccessResponse, INoticeCreatePayload>({
      query: (values) => {
        const { thumbnail, medias, department, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (department === null || department === '') {
          body.append('department', '');
        } else if (department !== undefined) {
          body.append('department', String(department));
        }

        // Append thumbnail if it's a File
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        // Append medias
        if (medias && medias.length > 0) {
          let mediaType: MediaType;
          medias.forEach((media, index) => {
            if (!media.file) return;

            if (media.file instanceof File) {
              body.append(`medias[${index}][file]`, media.file);
              mediaType = media.file.type === 'application/pdf' ? MediaType.DOCUMENT : MediaType.IMAGE;
            }
            if (media.caption) {
              body.append(`medias[${index}][caption]`, media.caption);
            }

            if (mediaType) {
              body.append(`medias[${index}][mediaType]`, mediaType);
            }
          });
        }

        return {
          url: `${noticeAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['Notice']
    }),

    patchNotice: builder.mutation<IMutationSuccessResponse, { id: string; values: INoticeUpdatePayload }>({
      query: ({ id, values }) => {
        const { thumbnail, medias, status, isDraft, department, ...rest } = values;

        // to match api format :
        // status is extracted for not sending it.
        // and isDraft for not sending it if false.
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (isDraft) {
          body.append('isDraft', String(isDraft));
        }

        if (department === null || department === '') {
          body.append('department', '');
        } else if (department !== undefined) {
          body.append('department', String(department));
        }

        // Append thumbnail if it's a File
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        // Append medias
        if (medias && medias.length > 0) {
          let mediaType: MediaType;
          medias.forEach((media, index) => {
            if (!media.file) return;

            if (media.file instanceof File) {
              body.append(`medias[${index}][file]`, media.file);
              mediaType = media.file.type === 'application/pdf' ? MediaType.DOCUMENT : MediaType.IMAGE;
            }
            if (media.id !== undefined) {
              body.append(`medias[${index}][id]`, String(media.id));
            }
            if (media.caption) {
              body.append(`medias[${index}][caption]`, media.caption);
            }

            if (mediaType || media.mediaType) {
              body.append(`medias[${index}][mediaType]`, mediaType || media.mediaType);
            }
          });
        }

        return {
          url: `${noticeAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['Notice']
    }),

    // Get Notice Categories
    getNoticeCategories: builder.query<INoticeCategoryListResponse, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });
        return {
          url: `${noticeAPI}/categories?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['Notice']
    }),

    // Get Notice Departments
    getNoticeDepartments: builder.query<INoticeDepartmentListResponse, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });
        return {
          url: `${noticeAPI}/departments?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['Notice']
    }),

    // Get Notice Authors
    getNoticeAuthors: builder.query<INoticeAuthorListResponse, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });
        return {
          url: `${noticeAPI}/authors?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['Notice']
    }),
    // Archive Notice
    deleteNotice: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => {
        return {
          url: `${noticeAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Notice']
    }),
    deleteNoticeMedia: builder.mutation<IMutationSuccessResponse, { id: string; media_id: string }>({
      query: ({ id, media_id }) => {
        return {
          url: `${noticeAPI}/${id}/media/${media_id}`,
          method: 'DELETE'
        };
      }
      // invalidatesTags: ['Notice']
    }),
    patchNoticeStatus: builder.mutation<IMutationSuccessResponse, { id: GridRowId | number; values: { status: NoticeStatus } }>({
      query: ({ id, values }) => {
        return {
          url: `${noticeAPI}/${id}/update-status`,
          method: 'PATCH',
          data: values
        };
      },
      invalidatesTags: ['Notice']
    })
  })
});

export const {
  useGetNoticesQuery,
  useLazyGetNoticesQuery,
  useRetrieveNoticeQuery,
  useLazyRetrieveNoticeQuery,
  useCreateNoticeMutation,
  usePatchNoticeMutation,
  useGetNoticeDepartmentsQuery,
  useGetNoticeCategoriesQuery,
  useGetNoticeAuthorsQuery,
  useDeleteNoticeMutation,
  useDeleteNoticeMediaMutation,
  usePatchNoticeStatusMutation
} = noticeAPISlice;
