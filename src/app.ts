import * as express from 'express';
import * as cors from 'cors';
import { createSite } from './controller';

const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(cors());

app.post(
  '/createSite',
  createSite
)

app.use((_req, res, _next) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason)
});

export default app;