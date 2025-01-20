import { z } from "zod";

export const OptionSchema = z.object({
  word: z.string(),
  translation: z.array(z.string()),
});
export type Option = z.infer<typeof OptionSchema>;
export const WordsListSchema = z.array(OptionSchema);
export type WordsList = z.infer<typeof WordsListSchema>;

const CorrectAnswerSchema = OptionSchema;

const QuestionSchema = z.object({
  sentence: z.string(),
  options: WordsListSchema,
  correctAnswer: CorrectAnswerSchema,
  translation: z.string(),
  description: z.string(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuestionListSchema = z.array(QuestionSchema);
export type QuestionList = z.infer<typeof QuestionListSchema>;
