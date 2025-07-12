import express, { Request, Response } from 'express';
import { KnowledgeBaseSearchResponseSchema } from './schemas';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

app.get('/api/v1/knowledgebases/:knowledgeBaseId/search', (req: Request, res: Response) => {
  const { knowledgeBaseId } = req.params;
  const { query, numberResults, documentId } = req.query;
  const authHeader = req.header('Authorization');

  // Placeholder: Implement your search logic here
  // Example response
  const response = {
    totalResults: 1,
    results: [
      {
        content: 'Example content',
        score: 0.95,
        citation: {
          documentId: documentId || 'doc-123',
          name: 'Sample Document',
          filename: 'sample.pdf',
        },
      },
    ],
  };

  // Validate response with Zod
  const validation = KnowledgeBaseSearchResponseSchema.safeParse(response);
  if (!validation.success) {
    return res.status(500).json({ error: 'Invalid response schema', details: validation.error });
  }

  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
