import { IListQueryParams, IMutationSuccessResponse } from '@/globals';
import { rootAPI } from '@/libs/apiSlice';
import { getQueryParams } from '@/utils/functions/queryBuilder';
import {
  IProjectCreatePayload,
  IProjectDetails,
  IProjectList,
  IProjectTag,
  IProjectTagCreatePayload,
  IProjectTagUpdatePayload,
  IProjectUpdatePayload
} from './types';

export const projectsAPI = 'cms/project-mod/projects';
export const projectTagsAPI = 'cms/project-mod/project-tags';

export const projectsAPISlice = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    //Get Projects
    getProjects: builder.query<IProjectList, IListQueryParams>({
      query: ({ search, paginationModel, sortModel, filterModel }) => {
        // build query params
        const { page, pageSize, orderingString, filterString } = getQueryParams({
          search,
          paginationModel,
          sortModel,
          filterModel
        });

        return {
          url: `${projectsAPI}?offset=${page * pageSize}&limit=${pageSize}&search=${search ?? ''}&ordering=${orderingString}&${filterString}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['Projects']
    }),

    // Retrieve Project
    retrieveProject: builder.query<IProjectDetails, string | null>({
      query: (id) => {
        return {
          url: `${projectsAPI}/${id}`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 0.1,
      providesTags: ['Projects']
    }),

    // Create Project
    createProject: builder.mutation<IMutationSuccessResponse, IProjectCreatePayload>({
      query: (values) => {
        const { members, tag_ids, thumbnail, report_file, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (thumbnail) {
          body.append('thumbnail', thumbnail);
        }

        if (report_file) {
          body.append('report_file', report_file);
        }

        if (members && members.length > 0) {
          body.append('members', JSON.stringify(members));
        }

        if (tag_ids && tag_ids.length > 0) {
          body.append('tag_ids', JSON.stringify(tag_ids));
        }

        return {
          url: projectsAPI,
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Projects']
    }),

    // Update Project
    updateProject: builder.mutation<IMutationSuccessResponse, IProjectUpdatePayload>({
      query: (values) => {
        const { id, members, tag_ids, thumbnail, report_file, ...rest } = values;
        const body = new FormData();

        for (const [key, value] of Object.entries(rest)) {
          if (value !== undefined && value !== null) {
            body.append(key, value as string | Blob);
          }
        }

        if (thumbnail) {
          body.append('thumbnail', thumbnail);
        }

        if (report_file) {
          body.append('report_file', report_file);
        }

        if (members) {
          body.append('members', JSON.stringify(members));
        }

        if (tag_ids) {
          body.append('tag_ids', JSON.stringify(tag_ids));
        }

        return {
          url: `${projectsAPI}/${id}`,
          method: 'PATCH',
          body
        };
      },
      invalidatesTags: ['Projects']
    }),

    // Delete Project
    deleteProject: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => {
        return {
          url: `${projectsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Projects']
    }),

    // Get Project Tags
    getProjectTags: builder.query<{ results: IProjectTag[] }, void>({
      query: () => {
        return {
          url: `${projectTagsAPI}?limit=100`,
          method: 'GET'
        };
      },
      keepUnusedDataFor: 300,
      providesTags: ['ProjectTags']
    }),

    // Create Project Tag
    createProjectTag: builder.mutation<IMutationSuccessResponse, IProjectTagCreatePayload>({
      query: (values) => {
        return {
          url: projectTagsAPI,
          method: 'POST',
          body: values
        };
      },
      invalidatesTags: ['ProjectTags']
    }),

    // Update Project Tag
    updateProjectTag: builder.mutation<IMutationSuccessResponse, IProjectTagUpdatePayload>({
      query: (values) => {
        const { id, ...rest } = values;
        return {
          url: `${projectTagsAPI}/${id}`,
          method: 'PATCH',
          body: rest
        };
      },
      invalidatesTags: ['ProjectTags']
    }),

    // Delete Project Tag
    deleteProjectTag: builder.mutation<IMutationSuccessResponse, string>({
      query: (id) => {
        return {
          url: `${projectTagsAPI}/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['ProjectTags']
    })
  })
});

export const {
  useGetProjectsQuery,
  useRetrieveProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectTagsQuery,
  useCreateProjectTagMutation,
  useUpdateProjectTagMutation,
  useDeleteProjectTagMutation
} = projectsAPISlice;
