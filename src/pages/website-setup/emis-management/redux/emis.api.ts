import { IListResponse, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import {
  IEmailResetRequest,
  IEmailResetRequestCreatePayload,
  IEmisHardware,
  IEmisHardwareCreatePayload,
  IEmisVpsInfo,
  IEmisVpsInfoCreatePayload
} from '../types';

const EMIS_API = 'cms/emis';

export const emisAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEmisHardware: builder.query<IListResponse<IEmisHardware>, void>({
      query: () => ({
        url: `${EMIS_API}/hardware`,
        method: 'GET'
      }),
      providesTags: ['EmisHardware']
    }),
    getEmisVpsInfo: builder.query<IListResponse<IEmisVpsInfo>, void>({
      query: () => ({
        url: `${EMIS_API}/vps-info`,
        method: 'GET'
      }),
      providesTags: ['EmisVpsInfo']
    }),
    getEmailResetRequests: builder.query<IListResponse<IEmailResetRequest>, void>({
      query: () => ({
        url: `${EMIS_API}/email-reset`,
        method: 'GET'
      }),
      providesTags: ['EmailResetRequest']
    }),
    createEmisHardware: builder.mutation<IMutationSuccessResponse, IEmisHardwareCreatePayload>({
      query: (values) => ({
        url: `${EMIS_API}/hardware`,
        method: 'POST',
        data: values
      }),
      invalidatesTags: ['EmisHardware']
    }),
    createEmisVpsInfo: builder.mutation<IMutationSuccessResponse, IEmisVpsInfoCreatePayload>({
      query: (values) => ({
        url: `${EMIS_API}/vps-info`,
        method: 'POST',
        data: values
      }),
      invalidatesTags: ['EmisVpsInfo']
    }),
    createEmailResetRequest: builder.mutation<IMutationSuccessResponse, IEmailResetRequestCreatePayload>({
      query: (values) => ({
        url: `${EMIS_API}/email-reset`,
        method: 'POST',
        data: values
      }),
      invalidatesTags: ['EmailResetRequest']
    })
  })
});

export const {
  useGetEmisHardwareQuery,
  useGetEmisVpsInfoQuery,
  useGetEmailResetRequestsQuery,
  useCreateEmisHardwareMutation,
  useCreateEmisVpsInfoMutation,
  useCreateEmailResetRequestMutation
} = emisAPISlice;
