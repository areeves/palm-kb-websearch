import { SearchEngine } from './SearchEngine';

export class BingSearchEngine implements SearchEngine {
  async search(query: string): Promise<any> {
    // TODO: Implement Bing search logic here
    return { engine: 'bing', results: [] };
  }
}
