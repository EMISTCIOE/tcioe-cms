import { IListQueryParams } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { IGlobalGalleryListResponse } from './types';

export const globalGalleryAPI = 'cms/website-mod/global-gallery';

export const globalGalleryAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalGallery: builder.query<IGlobalGalleryListResponse, IListQueryParams>({
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
          url: `${globalGalleryAPI}?${params}`,
          method: 'GET'
        };
      },
      providesTags: ['GlobalGallery'],
      keepUnusedDataFor: 0.1
    })
  })
});

export const { useGetGlobalGalleryQuery, useLazyGetGlobalGalleryQuery } = globalGalleryAPISlice;
