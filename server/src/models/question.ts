import { Option } from "./option";

export type Question = {
  sentence: string;
  options: Option[];
  correctAnswer: string;
  targetWord: string;
}