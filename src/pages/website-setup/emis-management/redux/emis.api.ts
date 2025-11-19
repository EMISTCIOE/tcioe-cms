import { IListResponse, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import {
  IEmailResetRequest,
  IEmailResetRequestCreatePayload,
  IEmisHardware,
  IEmisHardwareCreatePayload,
  IEmisVpsInfo,
  IEmisVpsInfoCreatePayload,
  IEmisVpsService,
  IEmisVpsServiceCreatePayload
} from '../types';

const EMIS_API = 'cms/emis';

export const emisAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Hardware endpoints
    getEmisHardware: builder.query<IListResponse<IEmisHardware>, void>({
      query: () => ({
        url: `${EMIS_API}/hardware`,
        method: 'GET'
      }),
      providesTags: ['EmisHardware']
    }),
    createEmisHardware: builder.mutation<IMutationSuccessResponse, FormData>({
      query: (data) => ({
        url: `${EMIS_API}/hardware`,
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
      invalidatesTags: ['EmisHardware']
    }),
    updateEmisHardware: builder.mutation<IMutationSuccessResponse, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `${EMIS_API}/hardware/${id}`,
        method: 'PUT',
        data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
      invalidatesTags: ['EmisHardware']
    }),
    deleteEmisHardware: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => ({
        url: `${EMIS_API}/hardware/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['EmisHardware']
    }),

    // VPS endpoints
    getEmisVpsInfo: builder.query<IListResponse<IEmisVpsInfo>, void>({
      query: () => ({
        url: `${EMIS_API}/vps-info`,
        method: 'GET'
      }),
      providesTags: ['EmisVpsInfo']
    }),
    createEmisVpsInfo: builder.mutation<IMutationSuccessResponse, IEmisVpsInfoCreatePayload>({
      query: (values) => ({
        url: `${EMIS_API}/vps-info`,
        method: 'POST',
        data: values
      }),
      invalidatesTags: ['EmisVpsInfo']
    }),
    updateEmisVpsInfo: builder.mutation<IMutationSuccessResponse, { id: string; data: IEmisVpsInfoCreatePayload }>({
      query: ({ id, data }) => ({
        url: `${EMIS_API}/vps-info/${id}`,
        method: 'PUT',
        data
      }),
      invalidatesTags: ['EmisVpsInfo']
    }),
    deleteEmisVpsInfo: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => ({
        url: `${EMIS_API}/vps-info/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['EmisVpsInfo', 'EmisVpsService']
    }),

    // VPS Services endpoints
    getEmisVpsServices: builder.query<IListResponse<IEmisVpsService>, void>({
      query: () => ({
        url: `${EMIS_API}/vps-services`,
        method: 'GET'
      }),
      providesTags: ['EmisVpsService']
    }),
    createEmisVpsService: builder.mutation<IMutationSuccessResponse, IEmisVpsServiceCreatePayload>({
      query: (values) => ({
        url: `${EMIS_API}/vps-services`,
        method: 'POST',
        data: values
      }),
      invalidatesTags: ['EmisVpsService', 'EmisVpsInfo']
    }),
    updateEmisVpsService: builder.mutation<IMutationSuccessResponse, { id: string; data: IEmisVpsServiceCreatePayload }>({
      query: ({ id, data }) => ({
        url: `${EMIS_API}/vps-services/${id}`,
        method: 'PUT',
        data
      }),
      invalidatesTags: ['EmisVpsService', 'EmisVpsInfo']
    }),
    deleteEmisVpsService: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => ({
        url: `${EMIS_API}/vps-services/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['EmisVpsService', 'EmisVpsInfo']
    }),

    // Email Reset Request endpoints
    getEmailResetRequests: builder.query<IListResponse<IEmailResetRequest>, void>({
      query: () => ({
        url: `${EMIS_API}/email-reset`,
        method: 'GET'
      }),
      providesTags: ['EmailResetRequest']
    }),
    createEmailResetRequest: builder.mutation<IMutationSuccessResponse, IEmailResetRequestCreatePayload>({
      query: (values) => ({
        url: `${EMIS_API}/email-reset`,
        method: 'POST',
        data: values
      }),
      invalidatesTags: ['EmailResetRequest']
    }),
    approveEmailResetRequest: builder.mutation<IMutationSuccessResponse, { id: string; data: { notes?: string } }>({
      query: ({ id, data }) => ({
        url: `${EMIS_API}/email-reset/${id}/approve`,
        method: 'POST',
        data
      }),
      invalidatesTags: ['EmailResetRequest']
    }),
    rejectEmailResetRequest: builder.mutation<IMutationSuccessResponse, { id: string; data: { notes?: string } }>({
      query: ({ id, data }) => ({
        url: `${EMIS_API}/email-reset/${id}/reject`,
        method: 'POST',
        data
      }),
      invalidatesTags: ['EmailResetRequest']
    })
  })
});

export const {
  // Hardware hooks
  useGetEmisHardwareQuery,
  useCreateEmisHardwareMutation,
  useUpdateEmisHardwareMutation,
  useDeleteEmisHardwareMutation,

  // VPS hooks
  useGetEmisVpsInfoQuery,
  useCreateEmisVpsInfoMutation,
  useUpdateEmisVpsInfoMutation,
  useDeleteEmisVpsInfoMutation,

  // VPS Services hooks
  useGetEmisVpsServicesQuery,
  useCreateEmisVpsServiceMutation,
  useUpdateEmisVpsServiceMutation,
  useDeleteEmisVpsServiceMutation,

  // Email Reset hooks
  useGetEmailResetRequestsQuery,
  useCreateEmailResetRequestMutation,
  useApproveEmailResetRequestMutation,
  useRejectEmailResetRequestMutation
} = emisAPISlice;
