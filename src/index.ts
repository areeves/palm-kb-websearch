import express, { Request, Response } from 'express';
import { setupSwagger } from './setup-swagger';
import knowledgeBaseRoutes from './routes/knowledgeBaseRoutes';
import searchRoutes from './routes/searchRoutes';
import scrapeRoutes from './routes/scrapeRoutes';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
setupSwagger(app);
app.use(knowledgeBaseRoutes);

app.use('/api', searchRoutes);
app.use('/api', scrapeRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
