import express from 'express';
import { SearchService } from '../services/SearchService';

const router = express.Router();
const searchService = new SearchService();

router.post('/search', async (req, res) => {
  const { query, numResults } = req.body;
  if (!query || typeof numResults !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid query or numResults' });
  }
  try {
    const results = await searchService.search(query, numResults);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err instanceof Error ? err.message : err });
  }
});

export default router;
