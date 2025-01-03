import { ViewModelFunc } from "@/components/ViewModelFunc";
import { Word } from "@/models/word";
import { useFocusEffect } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";

type State = {
  words: Word[];
};

type Action = object;

export const useAppTopPageViewModel: ViewModelFunc<State, Action> = () => {
  const db = useSQLiteContext();
  const [words, setWords] = useState<Word[]>([]);

  const getWords = useCallback(async () => {
    return await db.getAllAsync<Word>(
      "SELECT text, translated_text_json as translatedTextJson FROM words",
    );
  }, [db]);

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
    action: {},
  };
};
