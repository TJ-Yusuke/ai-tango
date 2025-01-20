import { initTRPC } from '@trpc/server';
import express from 'express';
import cors from 'cors';
import superjson from 'superjson';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { generateContent } from './vertexai.js';
import { WordsListSchema } from './models/question.js';

const t = initTRPC.create({
  transformer: superjson,
});

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
const port = 3000

app.use(cors());
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})