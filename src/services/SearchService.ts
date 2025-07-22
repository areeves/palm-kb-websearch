import { SearchEngine } from '../search/SearchEngine';
import { GoogleSearchEngine } from '../search/GoogleSearchEngine';
import { BingSearchEngine } from '../search/BingSearchEngine';

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export class SearchService {
  private engine: SearchEngine;

  constructor() {
    const engineName = process.env.SEARCH_ENGINE || 'google';
    if (engineName === 'bing') {
      this.engine = new BingSearchEngine();
    } else {
      this.engine = new GoogleSearchEngine();
    }
  }

  async search(query: string, numResults: number): Promise<SearchResult[]> {
    const results = await this.engine.search(query);
    return results.slice(0, numResults).map(r => ({
      title: r.title,
      snippet: r.snippet,
      url: r.link
    }));
  }
}
}
