import { trpc } from "../../../trpc";
import { ViewModelFunc } from "../../../components/ViewModelFunc";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Question,
  QuestionList,
  Option,
  WordsList,
} from "../../../../server/src/models/question";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { getAllWords, getRandomWords, registerWord } from "../../../db/db";
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
  addToVocabulary: (value: Option) => void;
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

  /**
   * ローディング時間を減らすために2件ずつ生成させる
   */
  const createQuestionList = useCallback(async (answerList: Word[]) => {
    try {
      setIsQuestionLoading(true);
      setIsError(false);
      // 2件ずつ生成するためのループ
      for (let i = 0; i < answerList.length; i += 2) {
        const request = createRequest(answerList.slice(i, i + 2));
        const response: QuestionList | undefined =
          await trpc.getQuestions.query(request);
        if (response) {
          setQuestionList((prevState) => [...prevState, ...response]);
          setIsQuestionLoading(false);
        } else {
          setIsQuestionLoading(false);
          setIsError(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  const addToVocabulary = async (word: Option) => {
    if (!addedWords.has(word.word)) {
      setAddedWords(new Set([...addedWords, word.word]));
      await registerWord(db, {
        wordText: word.word,
        translatedWordsList: word.translation,
      });
    }
  };

  useEffect(() => {
    (async () => {
      const answerList = await getRandomWords({
        db: db,
        excludeWords: [],
        length: 10,
      });
      answerList.map((value) => {
        console.log(value.text);
      });
      await createQuestionList(answerList);
    })();
  }, [createQuestionList, db]);

  useEffect(() => {
    questionList.map((value) => {
      console.log(value.correctAnswer.word);
    });
  }, [questionList]);

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
