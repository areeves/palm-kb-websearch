import { Router } from 'express';
import { ScrapeService } from '../services/ScrapeService';

const router = Router();

router.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing url property' });
  }
  try {
    const result = await ScrapeService.scrape(url);
    res.json(result);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    res.status(500).json({ error: 'Failed to scrape page', details: error.message });
  }
});

export default router;
