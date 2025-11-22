export interface IProjectMember {
  id?: string;
  full_name: string;
  roll_number: string;
  email?: string;
  phone_number?: string;
  department?: string;
  department_name?: string;
  role: string;
  linkedin_url?: string;
  github_url?: string;
}

export interface IProjectTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  project_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IProjectTagCreatePayload {
  name: string;
  description?: string;
  color: string;
}

export interface IProjectTagUpdatePayload extends IProjectTagCreatePayload {
  id: string;
}

export interface IProject {
  id: string;
  title: string;
  description?: string;
  abstract?: string;
  project_type: string;
  status: string;
  department?: string;
  department_name?: string;
  academic_program?: string;
  academic_program_name?: string;
  academic_program_short_name?: string;
  supervisor_name: string;
  supervisor_email?: string;
  start_date?: string;
  end_date?: string;
  academic_year?: string;
  github_url?: string;
  demo_url?: string;
  report_file?: string;
  thumbnail?: string;
  technologies_used?: string;
  is_featured: boolean;
  is_published: boolean;
  views_count: number;
  members?: IProjectMember[];
  tags?: IProjectTag[];
  members_count?: number;
  created_at: string;
  updated_at: string;
}

export interface IProjectList {
  count: number;
  next: string | null;
  previous: string | null;
  results: IProject[];
}

export interface IProjectCreatePayload {
  title: string;
  description?: string;
  abstract?: string;
  project_type: string;
  status: string;
  department?: string;
  academic_program?: string;
  supervisor_name: string;
  supervisor_email?: string;
  start_date?: string;
  end_date?: string;
  academic_year?: string;
  github_url?: string;
  demo_url?: string;
  report_file?: File;
  thumbnail?: File;
  technologies_used?: string;
  is_featured: boolean;
  is_published: boolean;
  members: IProjectMember[];
  tag_ids: string[];
}

export interface IProjectUpdatePayload extends IProjectCreatePayload {
  id: string;
}

export interface IProjectDetails extends IProject {
  members: IProjectMember[];
  tags: IProjectTag[];
}
