// Utility module for Google Custom Search API
import fetch from 'node-fetch';

export interface GoogleSearchResult {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  cacheId?: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
}

export async function googleSearch(query: string, apiKey?: string, searchEngineId?: string): Promise<GoogleSearchResult[]> {
  const key = apiKey || process.env.GCP_API_KEY;
  const cx = searchEngineId || process.env.GCP_CSE_ID;
  if (!key || !cx) {
    throw new Error('GCP_API_KEY and GCP_CSE_ID must be provided as arguments or environment variables.');
  }
  const url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.items || [];
}
