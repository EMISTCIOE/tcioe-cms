import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  IGlobalGalleryCollection,
  IGlobalGalleryCollectionCreatePayload,
  IGlobalGalleryCollectionList,
  IGlobalGalleryCollectionUpdatePayload
} from './globalGalleryCollections.types';

export const globalGalleryCollectionsAPI = 'cms/website-mod/gallery-collections';

export const globalGalleryCollectionsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalGalleryCollections: builder.query<IGlobalGalleryCollectionList, IListQueryParams>({
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
          url: `${globalGalleryCollectionsAPI}?${params}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['GlobalGalleryCollections']
    }),

    retrieveGlobalGalleryCollection: builder.query<IGlobalGalleryCollection, number | null>({
      query: (id) => ({
        url: `${globalGalleryCollectionsAPI}/${id}`,
        method: 'GET'
      }),
      providesTags: ['GlobalGalleryCollections']
    }),

    createGlobalGalleryCollection: builder.mutation<IMutationSuccessResponse, IGlobalGalleryCollectionCreatePayload>({
      query: (values) => {
        const {
          images,
          campusEvent,
          studentClubEvent,
          departmentEvent,
          union,
          club,
          department,
          title,
          description,
          isActive
        } = values;
        const body = new FormData();

        if (title) body.append('title', title);
        if (description) body.append('description', description);
        if (typeof isActive === 'boolean') body.append('is_active', String(isActive));
        if (campusEvent !== undefined && campusEvent !== null) body.append('campus_event', String(campusEvent));
        if (studentClubEvent !== undefined && studentClubEvent !== null) body.append('student_club_event', String(studentClubEvent));
        if (departmentEvent !== undefined && departmentEvent !== null) body.append('department_event', String(departmentEvent));
        if (union !== undefined && union !== null) body.append('union', String(union));
        if (club !== undefined && club !== null) body.append('club', String(club));
        if (department !== undefined && department !== null) body.append('department', String(department));

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
          url: `${globalGalleryCollectionsAPI}`,
          method: 'POST',
          data: body
        };
      },
      invalidatesTags: ['GlobalGalleryCollections']
    }),

    patchGlobalGalleryCollection: builder.mutation<
      IMutationSuccessResponse,
      { id: number; values: IGlobalGalleryCollectionUpdatePayload }
    >({
      query: ({ id, values }) => {
        const {
          images,
          campusEvent,
          studentClubEvent,
          departmentEvent,
          union,
          club,
          department,
          title,
          description,
          isActive
        } = values;
        const body = new FormData();

        if (title !== undefined) body.append('title', title);
        if (description !== undefined) body.append('description', description);
        if (typeof isActive === 'boolean') body.append('is_active', String(isActive));
        if (campusEvent !== undefined) {
          if (campusEvent === null) body.append('campus_event', '');
          else body.append('campus_event', String(campusEvent));
        }
        if (studentClubEvent !== undefined) {
          if (studentClubEvent === null) body.append('student_club_event', '');
          else body.append('student_club_event', String(studentClubEvent));
        }
        if (departmentEvent !== undefined) {
          if (departmentEvent === null) body.append('department_event', '');
          else body.append('department_event', String(departmentEvent));
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

        (images || []).forEach((item, index) => {
          if (item.image instanceof File) {
            body.append(`images[${index}][image]`, item.image);
          }
          if (item.id !== undefined) {
            body.append(`images[${index}][id]`, String(item.id));
          }
          if (item.caption) {
            body.append(`images[${index}][caption]`, item.caption);
          }
          if (item.displayOrder !== undefined) {
            body.append(`images[${index}][display_order]`, String(item.displayOrder));
          }
        });

        return {
          url: `${globalGalleryCollectionsAPI}/${id}`,
          method: 'PATCH',
          data: body
        };
      },
      invalidatesTags: ['GlobalGalleryCollections']
    }),

    deleteGlobalGalleryCollection: builder.mutation<IMutationSuccessResponse, number>({
      query: (id) => ({
        url: `${globalGalleryCollectionsAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['GlobalGalleryCollections']
    })
  })
});

export const {
  useGetGlobalGalleryCollectionsQuery,
  useLazyGetGlobalGalleryCollectionsQuery,
  useRetrieveGlobalGalleryCollectionQuery,
  useLazyRetrieveGlobalGalleryCollectionQuery,
  useCreateGlobalGalleryCollectionMutation,
  usePatchGlobalGalleryCollectionMutation,
  useDeleteGlobalGalleryCollectionMutation
} = globalGalleryCollectionsAPISlice;
