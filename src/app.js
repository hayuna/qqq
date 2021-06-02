import express from 'express';
import cors from 'cors';
import { createSite } from './controller.js';
import { schema, validateBody } from './validators/index.js';

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cors());

app.post(
  '/createSite', 
  validateBody(schema), 
  createSite
)

app.use((_req, res, _next) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;