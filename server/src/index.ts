import { initTRPC } from '@trpc/server';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import superjson from 'superjson';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { generateContent } from './vertexai.js';
import { WordsListSchema } from './models/question.js';

const t = initTRPC.create({
  transformer: superjson,
});


const SECRET_KEY = process.env.API_SECRET_KEY;

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === SECRET_KEY) {
      next();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};

const appRouter = t.router({
  getQuestions: t.procedure
  .input(WordsListSchema)
  .query(async ({ input }) => {
    console.log(input)
    return await generateContent(input);
  }),
});
export type AppRouter = typeof appRouter;

const app = express();
const port = 8080

app.use(cors());
app.use(
  '/trpc',
  authenticateToken,
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})