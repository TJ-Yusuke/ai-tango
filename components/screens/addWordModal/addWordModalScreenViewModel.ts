import { ViewModelFunc } from "@/components/ViewModelFunc";
import { Word } from "@/models/word";

type State = {
  words: Word[];
  isAddWordModalVisible: boolean;
};

type Action = {
  addWord: (word: Word) => void;
  setIsAddWordModalVisible: (isVisible: boolean) => void;
};

export const useAddWordModalScreenViewModel: ViewModelFunc<
  State,
  Action
> = () => {
  return {
    state: { words: [], isAddWordModalVisible: false },
    action: {
      addWord: () => null,
      setIsAddWordModalVisible: (isVisible: boolean) => null,
    },
  };
};
