import { z } from "zod";

const OptionSchema = z.object({
  word: z.string(),
  translation: z.string(),
});

const CorrectAnswerSchema = OptionSchema;

const QuestionSchema = z.object({
  sentence: z.string(),
  options: z.array(OptionSchema),
  correctAnswer: CorrectAnswerSchema,
  translation: z.string(),
  description: z.string(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuestionListSchema = z.array(QuestionSchema);
export type QuestionList = z.infer<typeof QuestionListSchema>;
