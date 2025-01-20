import { z } from "zod";
import { Option } from "./option.js";

export type Question = {
  sentence: string;
  options: Option[];
  correctAnswer: string;
  targetWord: string;
}

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

export const QuestionListSchema = z.array(QuestionSchema);
export type QuestionList = z.infer<typeof QuestionListSchema>;
