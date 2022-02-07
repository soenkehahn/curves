import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { newState, State, update } from "./state";

type AppState = {
  started: boolean;
  time: DOMHighResTimeStamp;
  state: State;
};

export const App = () => {
  let [appState, setAppState] = useState<AppState>({
    started: false,
    time: performance.now(),
    state: newState(),
  });

  const tick = useCallback(
    (now: DOMHighResTimeStamp) => {
      setAppState((appState: AppState) => {
        const timeDelta = now - appState.time;
        return {
          started: true,
          time: now,
          state: update(timeDelta, appState.state),
        };
      });
      window.requestAnimationFrame(tick);
    },
    [setAppState]
  );

  useEffect(() => {
    if (!appState.started) {
      window.requestAnimationFrame(tick);
    }
  }, [appState]);

  return <Game state={appState.state} />;
};

const Game = ({ state }: { state: State }) => {
  return <div>time: {JSON.stringify(state.position / 1000)}</div>;
};
