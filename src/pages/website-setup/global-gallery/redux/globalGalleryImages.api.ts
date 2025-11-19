import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  IGlobalGalleryImage,
  IGlobalGalleryImageCreatePayload,
  IGlobalGalleryImageList,
  IGlobalGalleryImageUpdatePayload
} from './globalGalleryImages.types';

export const globalGalleryImagesAPI = 'cms/website-mod/gallery-images';

export const globalGalleryImagesAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalGalleryImages: builder.query<IGlobalGalleryImageList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        const params = [
          `offset=${page * pageSize}`,
          `limit=${pageSize}`,
          `search=${search ?? ''}`,
          orderingString ? `ordering=${orderingString}` : '',
          filterString
        ]
          .filter(Boolean)
          .join('&');

        return {
          url: `${globalGalleryImagesAPI}?${params}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['GlobalGallery']
    }),

    retrieveGlobalGalleryImage: builder.query<IGlobalGalleryImage, string | null>({
      query: (id) => ({
        url: `${globalGalleryImagesAPI}/${id}`,
        method: 'GET'
      }),
      providesTags: ['GlobalGallery']
    }),

    createGlobalGalleryImages: builder.mutation<IMutationSuccessResponse, IGlobalGalleryImageCreatePayload>({
      query: (values) => {
        const { images, union, club, department, globalEvent, sourceTitle, sourceContext, isActive } = values;
        const body = new FormData();
        if (typeof isActive === 'boolean') body.append('is_active', String(isActive));
        if (union !== undefined && union !== null) body.append('union', String(union));
        if (club !== undefined && club !== null) body.append('club', String(club));
        if (department !== undefined && department !== null) body.append('department', String(department));
        if (globalEvent !== undefined && globalEvent !== null) body.append('global_event', String(globalEvent));
        if (sourceTitle) body.append('source_title', sourceTitle);
        if (sourceContext) body.append('source_context', sourceContext);

        (images || []).forEach((item, index) => {
          if (item.image instanceof File) {
            body.append(`images[${index}][image]`, item.image);
          }
          if (item.caption) {
            body.append(`images[${index}][caption]`, item.caption);
          }
          if (item.displayOrder !== undefined) {
            body.append(`images[${index}][display_order]`, String(item.displayOrder));
          }
        });

        return {
          url: `${globalGalleryImagesAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['GlobalGallery']
    }),

    patchGlobalGalleryImage: builder.mutation<IMutationSuccessResponse, { id: string; values: IGlobalGalleryImageUpdatePayload }>({
      query: ({ id, values }) => {
        const { union, club, department, globalEvent, sourceTitle, sourceContext, isActive, image, caption, displayOrder } = values;
        const body = new FormData();

        if (typeof isActive === 'boolean') {
          body.append('is_active', String(isActive));
        }
        if (union !== undefined) {
          if (union === null) body.append('union', '');
          else body.append('union', String(union));
        }
        if (club !== undefined) {
          if (club === null) body.append('club', '');
          else body.append('club', String(club));
        }
        if (department !== undefined) {
          if (department === null) body.append('department', '');
          else body.append('department', String(department));
        }
        if (globalEvent !== undefined) {
          if (globalEvent === null) body.append('global_event', '');
          else body.append('global_event', String(globalEvent));
        }
        if (sourceTitle !== undefined) {
          if (sourceTitle === null) body.append('source_title', '');
          else body.append('source_title', sourceTitle);
        }
        if (sourceContext !== undefined) {
          if (sourceContext === null) body.append('source_context', '');
          else body.append('source_context', sourceContext);
        }
        if (image instanceof File) {
          body.append('image', image);
        }
        if (caption !== undefined) body.append('caption', caption || '');
        if (displayOrder !== undefined) body.append('display_order', String(displayOrder));

        return {
          url: `${globalGalleryImagesAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['GlobalGallery']
    }),

    deleteGlobalGalleryImage: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => ({
        url: `${globalGalleryImagesAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['GlobalGallery']
    })
  })
});

export const {
  useGetGlobalGalleryImagesQuery,
  useLazyGetGlobalGalleryImagesQuery,
  useRetrieveGlobalGalleryImageQuery,
  useLazyRetrieveGlobalGalleryImageQuery,
  useCreateGlobalGalleryImagesMutation,
  usePatchGlobalGalleryImageMutation,
  useDeleteGlobalGalleryImageMutation
} = globalGalleryImagesAPISlice;
