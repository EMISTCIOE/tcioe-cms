import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { ICampusFeedbacksList, ICampusFeedbacksDetails, ICampusFeedbacksUpdatePayload } from './types';
import { GridRowId } from '@mui/x-data-grid';

export const campusFeedbacksAPI = 'cms/website-mod/campus-feedbacks';

export const campusFeedbacksAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get CampusFeedbacks
    getCampusFeedbacks: builder.query<ICampusFeedbacksList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${campusFeedbacksAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusFeedbacks']
    }),

    // Retrieve CampusFeedbacks
    retrieveCampusFeedbacks: builder.query<ICampusFeedbacksDetails, number | null>({
      query: (id) => {
        return {
          url: `${campusFeedbacksAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['CampusFeedbacks']
    }),

    // Resolve CampusFeedbacks
    resolveCampusFeedbacks: builder.mutation<IMutationSuccessResponse, { id: GridRowId | number; values: ICampusFeedbacksUpdatePayload }>({
      query: ({ id, values }) => {
        return {
          url: `${campusFeedbacksAPI}/${id}/resolve`,
          method: 'PATCH',
          data: values
        };
      },
      invalidatesTags: ['CampusFeedbacks']
    })
  })
});

export const {
  useGetCampusFeedbacksQuery,
  useLazyGetCampusFeedbacksQuery,
  useRetrieveCampusFeedbacksQuery,
  useLazyRetrieveCampusFeedbacksQuery,
  useResolveCampusFeedbacksMutation
} = campusFeedbacksAPISlice;
