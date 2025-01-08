import { initTRPC } from '@trpc/server';
import express from 'express';
import cors from 'cors';
import superjson from 'superjson';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { Question } from './models/question'

const t = initTRPC.create({
  transformer: superjson,
});

const appRouter = t.router({
  getQuestions: t.procedure.query(() => {
    const questions: Question[] = [
      {
        sentence: "I need to _____ this document before sending it.",
        options: [
          { id: "A", word: "review", translation: "レビューする、確認する" },
          { id: "B", word: "contain", translation: "含む、収容する" },
          { id: "C", word: "mention", translation: "言及する、述べる" },
          { id: "D", word: "describe", translation: "説明する、描写する" },
        ],
        correctAnswer: "review",
        targetWord: "review",
      },
      {
        sentence: "She plans to _____ the meeting tomorrow.",
        options: [
          { id: "A", word: "reschedule", translation: "再調整する" },
          { id: "B", word: "attend", translation: "出席する" },
          { id: "C", word: "cancel", translation: "キャンセルする" },
          { id: "D", word: "present", translation: "発表する" },
        ],
        correctAnswer: "attend",
        targetWord: "attend",
      },
    ];
    return questions;
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

