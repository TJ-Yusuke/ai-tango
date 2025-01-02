import { ViewModelFunc } from "@/components/ViewModelFunc";
import { Word } from "@/models/word";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

type State = {
  words: Word[];
  isAddWordModalVisible: boolean;
};

type Action = {
  addWord: (word: Word) => void;
  setIsAddWordModalVisible: (isVisible: boolean) => void;
};

export const useAppTopPageViewModel: ViewModelFunc<State, Action> = () => {
  const db = useSQLiteContext();
  const [words, setWords] = useState<Word[]>([]);
  const [isAddWordModalVisible, setIsAddWordModalVisible] =
    useState<boolean>(false);

  const getWords = useCallback(async () => {
    return await db.getAllAsync<Word>(
      "SELECT text, translated_text_json as translatedTextJson FROM words",
    );
  }, [db]);

  const addWord = useCallback(
    async (word: Word) => {
      try {
        const result = await db.runAsync(
          "INSERT INTO words (text, translated_text_json) VALUES (?, ?)",
          word.text,
          word.translatedTextJson,
        );
        console.log("data insert successful" + result.changes);
        setWords((prevState) => [...prevState, word]);
      } catch {
        console.log("data insert failed");
      }
    },
    [db],
  );

  useEffect(() => {
    (async () => {
      // const result = await getWords();
      const result: Word[] = [
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
        { text: "continual", translatedTextJson: '["断続的な", "継続的な"]' },
      ];
      setWords(result);
    })();
  }, [getWords]);

  return {
    state: {
      words,
      isAddWordModalVisible,
    },
    action: {
      addWord,
      setIsAddWordModalVisible: (isVisible) => {
        setIsAddWordModalVisible(isVisible);
      },
    },
  };
};
