import { SearchEngine } from './SearchEngine';

export class GoogleSearchEngine implements SearchEngine {
  async search(query: string): Promise<any> {
    // TODO: Implement Google search logic here
    return { engine: 'google', results: [] };
  }
}
