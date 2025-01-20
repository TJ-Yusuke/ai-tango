import { trpc } from "../../../trpc";
import { ViewModelFunc } from "../../../components/ViewModelFunc";
import { useEffect, useMemo, useState } from "react";
import { Question, QuestionList } from "../../../../server/src/models/question";
import { useRouter } from "expo-router";

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

      const response: QuestionList | undefined = await trpc.getQuestions.query([
        "a",
        "a",
      ]);
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
