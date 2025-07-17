export interface SearchEngine {
  search(query: string): Promise<any>;
}
