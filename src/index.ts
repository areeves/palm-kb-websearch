import express, { Request, Response } from 'express';
import { KnowledgeBaseSearchResponseSchema } from './schemas';
import { GoogleSearchEngine } from './search/GoogleSearchEngine';
import { BingSearchEngine } from './search/BingSearchEngine';
import { SearchEngine } from './search/SearchEngine';
import puppeteer from 'puppeteer';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

app.get('/api/v1/knowledgebases/:knowledgeBaseId/search', async (req: Request, res: Response) => {
  const { knowledgeBaseId } = req.params;
  const { query, numberResults, documentId } = req.query;
  const authHeader = req.header('Authorization');

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter' });
  }

  let searchEngine: SearchEngine;
  const engineEnv = (process.env.SEARCH_ENGINE || 'google').toLowerCase();
  switch (engineEnv) {
    case 'bing':
      searchEngine = new BingSearchEngine();
      break;
    case 'google':
    default:
      searchEngine = new GoogleSearchEngine();
  }

  try {
    const searchResults = await searchEngine.search(query);
    const resultsToFetch = (searchResults || []).slice(0, Number(numberResults) || 5);
    // Use puppeteer to fetch page contents
    const browser = await puppeteer.launch({ headless: true });
    const pageContents: string[] = [];
    for (const item of resultsToFetch) {
      const page = await browser.newPage();
      try {
        await page.goto(item.link, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const content = await page.content();
        pageContents.push(content);
      } catch (err) {
        pageContents.push('');
      } finally {
        await page.close();
      }
    }
    await browser.close();
    const results = resultsToFetch.map((item: any, idx: number) => ({
      content: pageContents[idx] || item.snippet || '',
      score: 1.0 - idx * 0.1, // Dummy score
      citation: {
        documentId: documentId || item.cacheId || `doc-${idx}`,
        name: item.title || 'Search Result',
        filename: item.displayLink || '',
      },
    }));
    const response = {
      totalResults: results.length,
      results,
    };
    // Validate response with Zod
    const validation = KnowledgeBaseSearchResponseSchema.safeParse(response);
    if (!validation.success) {
      return res.status(500).json({ error: 'Invalid response schema', details: validation.error });
    }
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
