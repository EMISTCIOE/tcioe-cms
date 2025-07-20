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
} from './types';

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
    retrieveNotice: builder.query<INoticeDetails, number | null>({
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
        const { thumbnail, medias, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append thumbnail if it's a File
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        // Append medias
        if (medias && medias.length > 0) {
          medias.forEach((media, index) => {
            if (media.file instanceof File) {
              console.log(`Appending media file: ${media.file.name}`);
              body.append(`medias[${index}][file]`, media.file);
            }
            if (media.caption) {
              body.append(`medias[${index}][caption]`, media.caption);
            }
            if (media.mediaType) {
              console.log(`Appending media type: ${media.mediaType}`);
              body.append(`medias[${index}][mediaType]`, media.mediaType);
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

    patchNotice: builder.mutation<IMutationSuccessResponse, { id: number; values: INoticeUpdatePayload }>({
      query: ({ id, values }) => {
        const { thumbnail, medias, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        // Append thumbnail if it's a File
        if (thumbnail instanceof File) {
          body.append('thumbnail', thumbnail);
        }

        // Append medias
        if (medias && medias.length > 0) {
          medias.forEach((media, index) => {
            if (media.file instanceof File) {
              body.append(`medias[${index}][file]`, media.file);
            }
            if (media.id !== undefined) {
              body.append(`medias[${index}][id]`, String(media.id));
            }
            if (media.caption) {
              body.append(`medias[${index}][caption]`, media.caption);
            }
            if (media.mediaType) {
              body.append(`medias[${index}][mediaType]`, media.mediaType);
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
    // archiveNotice: builder.mutation<IMutationSuccessResponse, number>({
    //   query: (id) => {
    //     return {
    //       url: `${noticeAPI}/${id}`,
    //       method: 'DELETE'
    //     };
    //   },
    //   invalidatesTags: ['Notice']
    // })
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
  // useArchiveNoticeMutation
} = noticeAPISlice;
