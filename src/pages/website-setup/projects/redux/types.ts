export interface IProjectMember {
  id?: number;
  full_name: string;
  roll_number: string;
  email?: string;
  phone_number?: string;
  department?: number;
  department_name?: string;
  role: string;
  linkedin_url?: string;
  github_url?: string;
}

export interface IProjectTag {
  id: number;
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
  id: number;
}

export interface IProject {
  id: number;
  title: string;
  description?: string;
  abstract?: string;
  project_type: string;
  status: string;
  department?: number;
  department_name?: string;
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
  department?: number;
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
  tag_ids: number[];
}

export interface IProjectUpdatePayload extends IProjectCreatePayload {
  id: number;
}

export interface IProjectDetails extends IProject {
  members: IProjectMember[];
  tags: IProjectTag[];
}
