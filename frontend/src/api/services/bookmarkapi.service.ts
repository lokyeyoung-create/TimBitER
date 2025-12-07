// frontend/src/api/services/bookmarkapi.service.ts
import { apiClient } from '../client';
import { PubMedArticle } from './pubmed.service';

export interface Bookmark {
  _id: string;
  userId: string;
  userType: 'Patient' | 'Doctor';
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  pubDate: string;
  abstract?: string;
  link: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const bookmarkService = {
  getAll: () => 
    apiClient.get<{ bookmarks: Bookmark[] }>('/bookmarksapi'),

  create: (article: PubMedArticle, notes?: string, tags?: string[]) => 
    apiClient.post<{ bookmark: Bookmark }>('/bookmarksapi', {
      pmid: article.pmid,
      title: article.title,
      authors: article.authors,
      journal: article.journal,
      pubDate: article.pubDate,
      abstract: article.abstract,
      link: article.link,
      notes: notes || '',
      tags: tags || []
    }),

  update: (bookmarkId: string, notes?: string, tags?: string[]) => 
    apiClient.put<{ bookmark: Bookmark }>(`/bookmarksapi/${bookmarkId}`, {
      notes,
      tags
    }),

  delete: (bookmarkId: string) => 
    apiClient.delete<{ message: string }>(`/bookmarksapi/${bookmarkId}`),

  checkBookmarked: (pmid: string) => 
    apiClient.get<{ isBookmarked: boolean; bookmark?: Bookmark }>(`/bookmarksapi/check/${pmid}`)
};