import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import { GridRowId } from '@mui/x-data-grid';
import { IPhoneNumberList, IPhoneNumber, IPhoneNumberCreatePayload, IPhoneNumberUpdatePayload } from './types';

export const phoneNumberAPI = 'cms/contact-mod/phone-numbers';

export const phoneNumberAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Get Phone Numbers
    getPhoneNumbers: builder.query<IPhoneNumberList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${phoneNumberAPI}/?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      providesTags: ['PhoneNumber']
    }),

    // Get Phone Number Details
    getPhoneNumberDetails: builder.query<IPhoneNumber, GridRowId>({
      query: (id) => ({
        url: `${phoneNumberAPI}/${id}/`,
        method: 'GET'
      }),
      providesTags: ['PhoneNumber']
    }),

    // Create Phone Number
    createPhoneNumber: builder.mutation<IMutationSuccessResponse, IPhoneNumberCreatePayload>({
      query: (data) => ({
        url: `${phoneNumberAPI}/`,
        method: 'POST',
        data
      }),
      invalidatesTags: ['PhoneNumber']
    }),

    // Update Phone Number
    updatePhoneNumber: builder.mutation<IMutationSuccessResponse, { id: GridRowId; data: IPhoneNumberUpdatePayload }>({
      query: ({ id, data }) => ({
        url: `${phoneNumberAPI}/${id}/`,
        method: 'PATCH',
        data
      }),
      invalidatesTags: ['PhoneNumber']
    }),

    // Delete Phone Number (soft delete)
    deletePhoneNumber: builder.mutation<IMutationSuccessResponse, GridRowId>({
      query: (id) => ({
        url: `${phoneNumberAPI}/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['PhoneNumber']
    }),

    // Bulk Delete Phone Numbers
    bulkDeletePhoneNumbers: builder.mutation<IMutationSuccessResponse, GridRowId[]>({
      query: (ids) => ({
        url: `${phoneNumberAPI}/bulk_delete/`,
        method: 'POST',
        data: { ids }
      }),
      invalidatesTags: ['PhoneNumber']
    })
  })
});

export const {
  useGetPhoneNumbersQuery,
  useGetPhoneNumberDetailsQuery,
  useCreatePhoneNumberMutation,
  useUpdatePhoneNumberMutation,
  useDeletePhoneNumberMutation,
  useBulkDeletePhoneNumbersMutation
} = phoneNumberAPISlice;
