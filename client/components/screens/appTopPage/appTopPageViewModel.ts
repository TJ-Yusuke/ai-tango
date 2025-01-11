import { ViewModelFunc } from "../../../components/ViewModelFunc";
import { Word } from "../../../models/word";
import { useFocusEffect } from "@react-navigation/native";
import {
  deleteWordByText as deleteWordByTextFromDb,
  getAllWords,
} from "../../../db/db";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";

type State = {
  words: Word[];
};

type Action = {
  deleteWordByText: (value: string) => void;
};

export const useAppTopPageViewModel: ViewModelFunc<State, Action> = () => {
  const db = useSQLiteContext();
  const [words, setWords] = useState<Word[]>([]);

  const getWords = useCallback(async () => {
    return await getAllWords(db);
  }, [db]);

  const deleteWordByText = useCallback(
    async (wordText: string) => {
      try {
        await deleteWordByTextFromDb(db, wordText);
        setWords((prevState) =>
          prevState.filter((item) => item.text !== wordText),
        );
      } catch (error) {
        console.error(`error occurred: ${error}`);
      }
    },
    [db],
  );

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const result = await getWords();
          setWords(result);
        } catch (error) {
          console.error("error occurred: ", error);
        }
      })();
      return () => {};
    }, [getWords]),
  );

  return {
    state: {
      words,
    },
    action: {
      deleteWordByText,
    },
  };
};
