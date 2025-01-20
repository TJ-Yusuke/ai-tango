import { trpc } from "../../../trpc";
import { ViewModelFunc } from "../../../components/ViewModelFunc";
import { useEffect, useMemo, useState } from "react";
import {
  Question,
  QuestionList,
  WordsList,
} from "../../../../server/src/models/question";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { getAllWords } from "../../../db/db";
import { Word } from "../../../models/word";

type State = {
  isQuestionLoading: boolean;
  isError: boolean;
  questionList: QuestionList;
  currentQuestionIndex: number;
  currentQuestion: Question;
  selectedAnswer: string | null;
  showResult: boolean;
  score: number;
  addedWords: Set<string>;
  isLastQuestion: boolean;
};

type Action = {
  selectAnswer: (value: string) => void;
  selectNoAnswer: () => void;
  proceedNextQuestion: () => void;
  finishLearning: () => void;
  addToVocabulary: (value: string) => void;
};

export const useLearnPageViewModel: ViewModelFunc<State, Action> = () => {
  const db = useSQLiteContext();

  const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [questionList, setQuestionList] = useState<QuestionList>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [addedWords, setAddedWords] = useState<Set<string>>(new Set());

  const router = useRouter();

  const fetchQuestions = async () => {
    try {
      setIsQuestionLoading(true);
      setIsError(false);

      const allWordsList = await getAllWords(db);
      const requestQuestionsList = shuffleFilterQuestions(allWordsList);
      const request = createRequest(requestQuestionsList);
      const response: QuestionList | undefined =
        await trpc.getQuestions.query(request);
      if (response) {
        setQuestionList(response);
      } else {
        setIsError(true);
      }
      setIsQuestionLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const shuffleFilterQuestions = (wordsList: Word[]): Word[] => {
    const shuffled = wordsList.slice();

    // Fisher-Yatesアルゴリズムでシャッフル
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 最大10個の要素を取得（元の配列が10個未満の場合、それに応じた数を返す）
    return shuffled.slice(0, 10);
  };

  const createRequest = (wordsList: Word[]): WordsList => {
    return wordsList.map((word) => {
      return {
        word: word.text,
        translation: JSON.parse(word.translatedTextJson) as string[],
      };
    });
  };

  const selectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === questionList[currentQuestionIndex].correctAnswer.word) {
      setScore(score + 1);
    }
  };

  const selectNoAnswer = () => {
    setShowResult(true);
  };

  const proceedNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const finishLearning = () => {
    router.dismiss();
  };

  const addToVocabulary = (word: string) => {
    if (!addedWords.has(word)) {
      setAddedWords(new Set([...addedWords, word]));
    }
  };

  useEffect(() => {
    (async () => {
      await fetchQuestions();
    })();
  }, []);

  const currentQuestion: Question = useMemo(() => {
    return questionList[currentQuestionIndex];
  }, [currentQuestionIndex, questionList]);

  const isLastQuestion = useMemo(() => {
    return currentQuestionIndex === questionList.length - 1;
  }, [currentQuestionIndex, questionList]);

  return {
    state: {
      isQuestionLoading,
      isError,
      questionList,
      currentQuestionIndex,
      currentQuestion,
      selectedAnswer,
      showResult,
      score,
      addedWords,
      isLastQuestion,
    },
    action: {
      selectAnswer,
      selectNoAnswer,
      proceedNextQuestion,
      finishLearning,
      addToVocabulary,
    },
  };
};
