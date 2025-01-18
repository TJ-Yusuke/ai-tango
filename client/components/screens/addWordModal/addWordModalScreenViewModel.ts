import {
  isWordAlreadyExists,
  registerWordParam,
  registerWord as registerWordToDb,
} from "../../../db/db";
import { ViewModelFunc } from "../../../components/ViewModelFunc";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";

const wordList: registerWordParam[] = [
  { wordText: "proposal", translatedWordsList: ["提案", "申し出", "企画"] },
  { wordText: "achieve", translatedWordsList: ["達成する", "成し遂げる"] },
  {
    wordText: "challenging",
    translatedWordsList: ["困難な", "やりがいのある"],
  },
  {
    wordText: "environment",
    translatedWordsList: ["環境", "状況", "雰囲気"],
  },
  {
    wordText: "develop",
    translatedWordsList: ["発展させる", "成長する", "開発する"],
  },
  { wordText: "strategic", translatedWordsList: ["戦略的な", "計画的な"] },
  {
    wordText: "efficiently",
    translatedWordsList: ["効率的に", "手際よく"],
  },
  {
    wordText: "break the ice",
    translatedWordsList: ["緊張を和らげる", "打ち解ける"],
  },
  {
    wordText: "difficult",
    translatedWordsList: ["困難な", "厄介な", "手強い"],
  },
  { wordText: "improve", translatedWordsList: ["改善する", "向上させる"] },
  { wordText: "consistently", translatedWordsList: ["一貫して", "常に"] },
  {
    wordText: "hit the nail on the head",
    translatedWordsList: ["的を射る", "核心を突く"],
  },
];

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
  registerWord: () => Promise<void>;
  debugBulkRegisterWord: () => Promise<void>;
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

  const debugBulkRegisterWord = useCallback(async () => {
    try {
      for (const word of wordList) {
        await registerWordToDb(db, {
          wordText: word.wordText,
          translatedWordsList: word.translatedWordsList,
        });
      }
      // uiに通知
      setIsDone(true);
    } catch (error) {
      console.error("データベースへの登録に失敗しました:", error);
    }
  }, [db]);

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
      debugBulkRegisterWord,
    },
  };
};
