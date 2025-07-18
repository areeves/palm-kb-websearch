
import express, { Request, Response } from 'express';
import { setupSwagger } from './swagger';
import knowledgeBaseRoutes from './routes/knowledgeBaseRoutes';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
setupSwagger(app);
app.use(knowledgeBaseRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

// ...existing code...

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
