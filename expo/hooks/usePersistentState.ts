import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

/*
  Custom hook, that extends React's useState, to save,
  state on AsyncStorage, so it persists during sessions.
*/
export function usePersistentState<StateType>(
  defaultState: StateType,
  localStorageId: string
): [StateType, React.Dispatch<React.SetStateAction<StateType>>] {
  const [state, setState] = useState<StateType>(defaultState);

  useEffect(() => {
    if (localStorageId.length <= 0) {
      return;
    }

    AsyncStorage.getItem(localStorageId)
      .then((value) => {
        if (value) {
          setState(JSON.parse(value));
        }
      })
      .catch((error) => {
        console.error("Error while fetching persistent state from AsyncStorage", error);
      });
  }, [localStorageId]);

  useEffect(() => {
    if (localStorageId.length <= 0) {
      return;
    }

    AsyncStorage.setItem(localStorageId, JSON.stringify(state)).catch((error) => {
      console.error("Error while fetching persistent state from AsyncStorage", error);
    });
  });

  return [state, setState];
}
