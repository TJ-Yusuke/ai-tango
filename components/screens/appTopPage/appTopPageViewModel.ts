import { ViewModelFunc } from "@/components/ViewModelFunc";
import { useState } from "react";

type State = {
  counter: number;
};

type Action = {
  countUp: () => void;
};

const useAppTopPageViewModel: ViewModelFunc<State, Action> = () => {
  const [counter, setCounter] = useState(0);
  return {
    state: {
      counter,
    },
    action: {
      countUp: () => setCounter((prevCount) => prevCount + 1),
    },
  };
};
