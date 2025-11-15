import { rootAPI } from '@/libs/apiSlice';

// Types for Dashboard Statistics
export interface UserStatistics {
  total: number;
  active: number;
  new_this_month: number;
  by_role: Record<string, number>;
}

export interface DepartmentStatistics {
  total: number;
  active: number;
}

export interface NoticeStatistics {
  total: number;
  active: number;
  draft: number;
  featured: number;
  by_category: Record<string, number>;
  recent_count: number;
}

export interface ProjectStatistics {
  total: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
  by_department: Record<string, number>;
  completed_this_year: number;
}

export interface ResearchStatistics {
  total: number;
  by_status: Record<string, number>;
  by_type: Record<string, number>;
  published_this_year: number;
}

export interface JournalStatistics {
  total_articles: number;
  total_authors: number;
  total_board_members: number;
}

export interface CurriculumStatistics {
  total_subjects: number;
  total_routines: number;
  total_suggestions: number;
}

export interface ContactStatistics {
  total_submissions: number;
  pending_inquiries: number;
}

export interface PendingItems {
  notices: number;
  research: number;
  events: number;
  projects: number;
  feedback: number;
}

export interface TrendData {
  month: string;
  count: number;
}

export interface ChartData {
  notices_trend: TrendData[];
  users_growth: TrendData[];
  research_publications_trend: TrendData[];
  events_trend: TrendData[];
  projects_trend: TrendData[];
}

export interface DashboardStatsResponse {
  status: string;
  cached: boolean;
  data: {
    calculated_at: string;
    user_statistics: UserStatistics;
    department_statistics: DepartmentStatistics;
    notice_statistics: NoticeStatistics;
    project_statistics: ProjectStatistics;
    research_statistics: ResearchStatistics;
    journal_statistics: JournalStatistics;
    curriculum_statistics: CurriculumStatistics;
    contact_statistics: ContactStatistics;
    pending_items: PendingItems;
    chart_data: ChartData;
  };
}

// Extend the rootAPI with dashboard endpoints
export const dashboardAPI = rootAPI.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, { refresh?: boolean }>({
      query: ({ refresh = false } = {}) => ({
        url: 'cms/core/dashboard-stats',
        method: 'GET',
        params: refresh ? { refresh: 'true' } : undefined
      }),
      // Cache for 30 minutes
      keepUnusedDataFor: 1800,
      providesTags: ['DashboardStats']
    })
  }),
  overrideExisting: false
});

// Export hooks for usage in functional components
export const { useGetDashboardStatsQuery, useLazyGetDashboardStatsQuery } = dashboardAPI;
