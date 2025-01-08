import { initTRPC } from '@trpc/server';
import express from 'express';
import cors from 'cors';
import superjson from 'superjson';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

const t = initTRPC.create({
  transformer: superjson,
});

const appRouter = t.router({
  hello: t.procedure.query(() => {
    return { message: 'Hello from tRPC server!' };
  }),
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(3000, () => {
  console.log('tRPC server is running on http://localhost:3000');
});

