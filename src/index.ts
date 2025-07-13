import express, { Request, Response } from 'express';
import { KnowledgeBaseSearchResponseSchema } from './schemas';
import { googleSearch } from './gcp-cse';

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

  try {
    const googleResults = await googleSearch(query);
    const results = (googleResults || []).slice(0, Number(numberResults) || 5).map((item, idx) => ({
      content: item.snippet || '',
      score: 1.0 - idx * 0.1, // Dummy score
      citation: {
        documentId: documentId || item.cacheId || `doc-${idx}`,
        name: item.title || 'Google Result',
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
