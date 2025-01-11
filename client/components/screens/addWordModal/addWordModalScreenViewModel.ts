import {
  isWordAlreadyExists,
  registerWord as registerWordToDb,
} from "../../../db/db";
import { ViewModelFunc } from "../../../components/ViewModelFunc";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";

type State = {
  wordText: string;
  translatedWordText: string;
  translatedWordsList: string[];
  wordTextValidationError: string;
  translatedWordTextValidationError: string;
  isDone: boolean;
};

type Action = {
  onWordTextChange: (value: string) => void;
  onTranslatedWordTextChange: (value: string) => void;
  addTranslatedWordsList: () => void;
  deleteTranslatedWordItemFromList: (value: string) => void;
  registerWord: () => void;
};

const hasDuplicateItem = (arr: string[], item: string): boolean => {
  const items = [...arr, item];
  const uniqueItems = new Set(items);
  return uniqueItems.size < items.length;
};

export const useAddWordModalScreenViewModel: ViewModelFunc<
  State,
  Action
> = () => {
  const db = useSQLiteContext();

  const [wordText, setWordText] = useState("");
  const [wordTextValidationError, setWordTextValidationError] = useState("");

  const [translatedWordText, setTranslatedWordText] = useState("");
  const [
    translatedWordTextValidationError,
    setTranslatedWordTextValidationError,
  ] = useState("");

  const [translatedWordsList, setTranslatedWordsList] = useState<string[]>([]);

  const [isDone, setIsDone] = useState<boolean>(false);

  const isWordAlreadyRegistered = useCallback(
    async (wordText: string) => await isWordAlreadyExists(db, wordText),
    [db],
  );

  const registerWord = useCallback(async () => {
    // バリデーション
    if (await isWordAlreadyRegistered(wordText)) {
      setWordTextValidationError("すでに登録されています");
      return;
    }
    // db登録
    try {
      await registerWordToDb(db, { wordText, translatedWordsList });
      // uiに通知
      setIsDone(true);
    } catch (error) {
      console.error("データベースへの登録に失敗しました:", error);
    }
  }, [db, isWordAlreadyRegistered, translatedWordsList, wordText]);

  return {
    state: {
      wordText,
      translatedWordText,
      translatedWordsList,
      wordTextValidationError,
      translatedWordTextValidationError,
      isDone,
    },
    action: {
      onWordTextChange: (value) => {
        setWordTextValidationError("");
        setWordText(value);
      },
      onTranslatedWordTextChange: (value) => {
        if (hasDuplicateItem(translatedWordsList, value)) {
          setTranslatedWordTextValidationError("すでに入力されています");
        } else {
          setTranslatedWordTextValidationError("");
        }
        setTranslatedWordText(value);
      },
      addTranslatedWordsList: () => {
        // エラーじゃない場合かつ空白じゃない場合はリストに追加
        if (
          translatedWordTextValidationError.length === 0 &&
          translatedWordText.length > 0
        ) {
          setTranslatedWordsList((prevState) => [
            ...prevState,
            translatedWordText,
          ]);
          setTranslatedWordText("");
        }
      },
      deleteTranslatedWordItemFromList: (value) => {
        setTranslatedWordsList((prevState) =>
          prevState.filter((item) => item !== value),
        );
      },
      registerWord,
    },
  };
};
