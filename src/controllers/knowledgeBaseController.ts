import { Request, Response } from 'express';
import { KnowledgeBaseSearchResponseSchema } from '../schemas';
import { GoogleSearchEngine } from '../search/GoogleSearchEngine';
import { BingSearchEngine } from '../search/BingSearchEngine';
import { SearchEngine } from '../search/SearchEngine';
import puppeteer from 'puppeteer';
import { htmlToMarkdown } from '../utils/htmlToMarkdown';

export async function searchKnowledgeBase(req: Request, res: Response) {
  const { knowledgeBaseId } = req.params;
  const { query, numberResults, documentId } = req.query;
  const authHeader = req.header('Authorization');

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter' });
  }

  const numResults = Number(numberResults) || 5;
  const searchService = new (await import('../services/SearchService')).SearchService();
  const scrapeService = (await import('../services/ScrapeService')).ScrapeService;

  try {
    const searchResults = await searchService.search(query, numResults);
    const results = [];
    for (let idx = 0; idx < searchResults.length; idx++) {
      const item = searchResults[idx];
      let scraped;
      try {
        scraped = await scrapeService.scrape(item.url);
      } catch (err) {
        scraped = { markdown: item.snippet || '', title: item.title, url: item.url };
      }
      results.push({
        content: scraped.markdown,
        score: 1.0 - idx * 0.1,
        citation: {
          documentId: documentId || `doc-${idx}`,
          name: scraped.title || item.title || 'Search Result',
          filename: scraped.url || '',
        },
      });
    }
    const response = {
      totalResults: results.length,
      results,
    };
    const validation = KnowledgeBaseSearchResponseSchema.safeParse(response);
    if (!validation.success) {
      return res.status(500).json({ error: 'Invalid response schema', details: validation.error });
    }
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
}
