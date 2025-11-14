import { rootAPI } from '@/libs/apiSlice';
import {
  IResearch,
  IResearchCreatePayload,
  IResearchListResponse,
  IResearchTag,
  IResearchTagCreatePayload,
  IResearchTagListResponse,
  IResearchFilters
} from './types';

export const researchAPI = 'cms/research-mod/research';
export const researchCategoriesAPI = 'cms/research-mod/research-categories';

export const researchApi = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    // Research CRUD
    getResearch: builder.query<IResearchListResponse, IResearchFilters>({
      query: (params = {}) => ({
        url: researchAPI,
        params: Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== ''))
      }),
      providesTags: (result) =>
        result
          ? [...result.results.map(({ id }) => ({ type: 'Research' as const, id })), { type: 'Research', id: 'LIST' }]
          : [{ type: 'Research', id: 'LIST' }]
    }),

    getResearchById: builder.query<IResearch, number>({
      query: (id) => `${researchAPI}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Research', id }]
    }),

    createResearch: builder.mutation<IResearch, IResearchCreatePayload>({
      query: (research) => ({
        url: researchAPI,
        method: 'POST',
        data: research
      }),
      invalidatesTags: [{ type: 'Research', id: 'LIST' }]
    }),

    updateResearch: builder.mutation<IResearch, Partial<IResearchCreatePayload> & { id: number }>({
      query: ({ id, ...research }) => ({
        url: `${researchAPI}/${id}`,
        method: 'PATCH',
        data: research
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Research', id },
        { type: 'Research', id: 'LIST' }
      ]
    }),

    deleteResearch: builder.mutation<void, number>({
      query: (id) => ({
        url: `${researchAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Research', id },
        { type: 'Research', id: 'LIST' }
      ]
    }),

    // Research Tags CRUD
    getResearchTags: builder.query<IResearchTagListResponse, { search?: string; ordering?: string }>({
      query: (params = {}) => ({
        url: researchCategoriesAPI,
        params: Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== ''))
      }),
      providesTags: (result) =>
        result
          ? [...result.results.map(({ id }) => ({ type: 'ResearchTag' as const, id })), { type: 'ResearchTag', id: 'LIST' }]
          : [{ type: 'ResearchTag', id: 'LIST' }]
    }),

    createResearchTag: builder.mutation<IResearchTag, IResearchTagCreatePayload>({
      query: (tag) => ({
        url: researchCategoriesAPI,
        method: 'POST',
        data: tag
      }),
      invalidatesTags: [{ type: 'ResearchTag', id: 'LIST' }]
    }),

    updateResearchTag: builder.mutation<IResearchTag, Partial<IResearchTagCreatePayload> & { id: number }>({
      query: ({ id, ...tag }) => ({
        url: `${researchCategoriesAPI}/${id}`,
        method: 'PATCH',
        data: tag
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'ResearchTag', id },
        { type: 'ResearchTag', id: 'LIST' }
      ]
    }),

    deleteResearchTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `${researchCategoriesAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'ResearchTag', id },
        { type: 'ResearchTag', id: 'LIST' }
      ]
    }),

    // Bulk operations
    bulkDeleteResearch: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: `${researchAPI}/bulk_delete`,
        method: 'POST',
        data: { ids }
      }),
      invalidatesTags: [{ type: 'Research', id: 'LIST' }]
    }),

    // Analytics endpoints
    getResearchStats: builder.query<
      {
        total_research: number;
        by_status: { [key: string]: number };
        by_type: { [key: string]: number };
        by_field: { [key: string]: number };
        monthly_research: { month: string; count: number }[];
        funding_summary: {
          total_funded: number;
          total_amount: number;
          by_agency: { [key: string]: number };
        };
      },
      void
    >({
      query: () => `${researchAPI}/stats`,
      providesTags: ['Research']
    })
  }),
  overrideExisting: false
});

export const {
  useGetResearchQuery,
  useGetResearchByIdQuery,
  useCreateResearchMutation,
  useUpdateResearchMutation,
  useDeleteResearchMutation,
  useGetResearchTagsQuery,
  useCreateResearchTagMutation,
  useUpdateResearchTagMutation,
  useDeleteResearchTagMutation,
  useBulkDeleteResearchMutation,
  useGetResearchStatsQuery
} = researchApi;
