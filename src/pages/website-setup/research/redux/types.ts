export interface IResearchParticipant {
  id: string;
  full_name: string;
  email?: string;
  participant_type: 'faculty' | 'staff' | 'student' | 'external';
  affiliation?: string;
  role: string;
  linkedin_url?: string;
  orcid_id?: string;
  google_scholar_url?: string;
  research: string;
}

export interface IResearchParticipantCreatePayload {
  full_name: string;
  email?: string;
  participant_type: 'faculty' | 'staff' | 'student' | 'external';
  affiliation?: string;
  role: string;
  linkedin_url?: string;
  orcid_id?: string;
  google_scholar_url?: string;
}

export interface IResearchPublication {
  id: string;
  title: string;
  authors: string;
  journal_name?: string;
  conference_name?: string;
  publication_date?: string;
  doi?: string;
  url?: string;
  citation_count?: number;
  research: string;
}

export interface IResearchPublicationCreatePayload {
  title: string;
  authors: string;
  journal_name?: string;
  conference_name?: string;
  publication_date?: string;
  doi?: string;
  url?: string;
  citation_count?: number;
}

export interface IResearchTag {
  id: string;
  name: string;
  description?: string;
  color: string;
  research_count: number;
  created_at: string;
  updated_at: string;
}

export interface IResearchTagCreatePayload {
  name: string;
  description?: string;
  color: string;
}

export interface IResearch {
  id: string;
  title: string;
  description?: string;
  abstract?: string;
  research_type: 'basic' | 'applied' | 'development' | 'interdisciplinary' | 'collaborative';
  status: 'proposal' | 'ongoing' | 'completed' | 'published' | 'cancelled';
  principal_investigator?: string;
  principal_investigator_short?: string;
  pi_email?: string;
  field_of_study: string;
  keywords?: string;
  methodology?: string;
  start_date?: string;
  end_date?: string;
  duration_months?: number;
  funding_agency?: string;
  funding_amount?: number;
  funding_currency?: string;
  expected_outcomes?: string;
  ethical_approval_number?: string;
  is_collaborative: boolean;
  collaboration_details?: string;
  github_url?: string;
  dataset_url?: string;
  website_url?: string;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  downloads_count: number;
  citation_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
  department?: string;
  department_name?: string;
  academic_program?: string;
  academic_program_name?: string;
  academic_program_short_name?: string;
  participants: IResearchParticipant[];
  publications: IResearchPublication[];
  tags: IResearchTag[];
}

export interface IResearchCreatePayload {
  title: string;
  description?: string;
  abstract?: string;
  research_type: 'basic' | 'applied' | 'development' | 'interdisciplinary' | 'collaborative';
  status: 'proposal' | 'ongoing' | 'completed' | 'published' | 'cancelled';
  principal_investigator?: string;
  pi_email?: string;
  field_of_study: string;
  keywords?: string;
  methodology?: string;
  start_date?: string;
  end_date?: string;
  duration_months?: number;
  funding_agency?: string;
  funding_amount?: number;
  funding_currency?: string;
  expected_outcomes?: string;
  ethical_approval_number?: string;
  is_collaborative: boolean;
  collaboration_details?: string;
  github_url?: string;
  dataset_url?: string;
  website_url?: string;
  is_featured: boolean;
  is_published: boolean;
  department?: string;
  academic_program?: string;
  participants: IResearchParticipantCreatePayload[];
  publications: IResearchPublicationCreatePayload[];
  tag_ids: string[];
}

export interface IResearchListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: IResearch[];
}

export interface IResearchTagListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: IResearchTag[];
}

export interface IResearchFilters {
  search?: string;
  research_type?: string;
  status?: string;
  field_of_study?: string;
  is_featured?: boolean;
  is_published?: boolean;
  is_collaborative?: boolean;
  funding_agency?: string;
  start_date_from?: string;
  start_date_to?: string;
  tag_ids?: string[];
  department?: string;
  academic_program?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
