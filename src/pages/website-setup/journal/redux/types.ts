export interface IJournalAuthor {
  id: string;
  given_name: string;
  family_name?: string;
  email?: string;
  affiliation?: string;
  country?: string;
  bio?: string;
}

export interface IJournalAuthorCreatePayload {
  given_name: string;
  family_name?: string;
  email?: string;
  affiliation?: string;
  country?: string;
  bio?: string;
}

export interface IJournalArticle {
  id: string;
  url_id: string;
  title: string;
  genre: string;
  date_published?: string;
  doi_id?: string;
  abstract: string;
  keywords?: string;
  discipline?: string;
  department?: string | number | null;
  department_name?: string | null;
  academic_program?: string | number | null;
  academic_program_name?: string | null;
  academic_program_short_name?: string | null;
  authors: IJournalAuthor[];
  submission_id?: number | null;
  volume?: number | null;
  number?: number | null;
  year?: number | null;
  pages?: string | null;
}

export interface IJournalArticleCreatePayload {
  url_id: string;
  title: string;
  genre: string;
  date_published?: string;
  doi_id?: string;
  abstract: string;
  keywords?: string;
  discipline?: string;
  department?: string | number;
  academic_program?: string | number;
  author_ids?: string[];
  submission_id?: number;
  volume?: number;
  number?: number;
  year?: number;
  pages?: string;
}

export interface IJournalArticleListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: IJournalArticle[];
}
