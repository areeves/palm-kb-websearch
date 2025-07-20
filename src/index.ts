
import express, { Request, Response } from 'express';
import { setupSwagger } from './setup-swagger';
import knowledgeBaseRoutes from './routes/knowledgeBaseRoutes';
import searchRoutes from './routes/searchRoutes';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
setupSwagger(app);
app.use(knowledgeBaseRoutes);
app.use('/api', searchRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

// ...existing code...

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
