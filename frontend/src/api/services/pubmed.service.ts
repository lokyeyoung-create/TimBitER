// frontend/src/api/services/pubmed.service.ts

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  pubDate: string;
  abstract?: string;
  doi?: string;
  link: string;
}

export interface PubMedSearchResponse {
  articles: PubMedArticle[];
  count: number;
  retmax: number;
}

class PubMedService {
  private readonly BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

  async search(query: string, maxResults: number = 20): Promise<PubMedSearchResponse> {
    try {
      const searchUrl = `${this.BASE_URL}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      const idList = searchData.esearchresult?.idlist || [];
      
      if (idList.length === 0) {
        return { articles: [], count: 0, retmax: maxResults };
      }

      const ids = idList.join(',');
      const summaryUrl = `${this.BASE_URL}/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
      const summaryResponse = await fetch(summaryUrl);
      const summaryData = await summaryResponse.json();

      const articles: PubMedArticle[] = idList.map((id: string) => {
        const article = summaryData.result[id];
        return {
          pmid: id,
          title: article.title || 'No title available',
          authors: article.authors?.map((a: any) => a.name) || [],
          journal: article.fulljournalname || article.source || 'Unknown Journal',
          pubDate: article.pubdate || 'Unknown',
          doi: article.elocationid || undefined,
          link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
        };
      });

      return {
        articles,
        count: parseInt(searchData.esearchresult.count || '0'),
        retmax: maxResults
      };
    } catch (error) {
      console.error('PubMed search error:', error);
      throw new Error('Failed to search PubMed. Please try again.');
    }
  }
}

export const pubmedService = new PubMedService();