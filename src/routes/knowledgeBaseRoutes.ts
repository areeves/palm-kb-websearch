import { Router } from 'express';
import { searchKnowledgeBase } from '../controllers/knowledgeBaseController';

const router = Router();

router.get('/api/v1/knowledgebases/:knowledgeBaseId/search', searchKnowledgeBase);

export default router;
