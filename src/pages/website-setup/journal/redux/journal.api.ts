import { IListQueryParams } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import {
  IJournalArticle,
  IJournalArticleCreatePayload,
  IJournalArticleListResponse,
  IJournalAuthor,
  IJournalAuthorCreatePayload
} from './types';

const articlesAPI = 'cms/journal-mod/articles';
const authorsAPI = 'cms/journal-mod/authors';

export const journalApi = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getJournalArticles: builder.query<IJournalArticleListResponse, Partial<IListQueryParams>>({
      query: ({ search, paginationModel, sortModel, filterModel } = {}) => {
        const params: Record<string, any> = {};
        if (search) params.search = search;
        if (paginationModel) {
          params.limit = paginationModel.pageSize;
          params.offset = (paginationModel.page ?? 0) * paginationModel.pageSize;
        }
        if (sortModel?.length) {
          params.ordering = sortModel.map((s: any) => `${s.sort === 'desc' ? '-' : ''}${s.field}`).join(',');
        }
        if (filterModel?.items?.length) {
          filterModel.items.forEach((item: any) => {
            params[item.field] = item.value;
          });
        }

        return {
          url: articlesAPI,
          params
        };
      },
      providesTags: (result) =>
        result
          ? [...result.results.map(({ id }) => ({ type: 'JournalArticle' as const, id })), { type: 'JournalArticle', id: 'LIST' }]
          : [{ type: 'JournalArticle', id: 'LIST' }]
    }),

    createJournalArticle: builder.mutation<IJournalArticle, IJournalArticleCreatePayload>({
      query: (payload) => ({
        url: articlesAPI,
        method: 'POST',
        data: payload
      }),
      invalidatesTags: [{ type: 'JournalArticle', id: 'LIST' }]
    }),

    updateJournalArticle: builder.mutation<IJournalArticle, { id: string } & Partial<IJournalArticleCreatePayload>>({
      query: ({ id, ...payload }) => ({
        url: `${articlesAPI}/${id}`,
        method: 'PATCH',
        data: payload
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'JournalArticle', id },
        { type: 'JournalArticle', id: 'LIST' }
      ]
    }),

    deleteJournalArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `${articlesAPI}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'JournalArticle', id },
        { type: 'JournalArticle', id: 'LIST' }
      ]
    }),

    getJournalAuthors: builder.query<{ results: IJournalAuthor[] }, void>({
      query: () => ({
        url: `${authorsAPI}?limit=200`,
        method: 'GET'
      }),
      providesTags: (result) =>
        result
          ? [...result.results.map(({ id }) => ({ type: 'JournalAuthor' as const, id })), { type: 'JournalAuthor', id: 'LIST' }]
          : [{ type: 'JournalAuthor', id: 'LIST' }]
    }),

    createJournalAuthor: builder.mutation<IJournalAuthor, IJournalAuthorCreatePayload>({
      query: (payload) => ({
        url: authorsAPI,
        method: 'POST',
        data: payload
      }),
      invalidatesTags: [{ type: 'JournalAuthor', id: 'LIST' }]
    })
  }),
  overrideExisting: false
});

export const {
  useGetJournalArticlesQuery,
  useCreateJournalArticleMutation,
  useUpdateJournalArticleMutation,
  useDeleteJournalArticleMutation,
  useGetJournalAuthorsQuery,
  useCreateJournalAuthorMutation
} = journalApi;
