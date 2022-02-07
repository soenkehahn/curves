import { CartesianGrid, LineChart, Line, YAxis, XAxis } from "recharts";
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { newHistory, History } from "./history";
import { upPressed, newState, State, update } from "./state";
import { wait } from "./utils";

type AppState = {
  started: boolean;
  time: DOMHighResTimeStamp;
  state: State;
  history: History<Sample>;
};

type Sample = { time: DOMHighResTimeStamp; state: State };

export const App = () => {
  let [appState, setAppState] = useState<AppState>(() => {
    const state = newState();
    const history = newHistory<Sample>(500);
    const now = performance.now();
    history.append({ time: now, state });
    return {
      started: false,
      time: now,
      state,
      history,
    };
  });

  const updateState = (update: (state: State) => State): void => {
    setAppState((appState) => {
      const newState = update(appState.state);
      return {
        ...appState,
        state: newState,
      };
    });
  };

  const tick = useCallback(
    (now: DOMHighResTimeStamp) => {
      setAppState((appState: AppState) => {
        const timeDelta = now - appState.time;
        const newState = update(timeDelta, appState.state);
        appState.history.append({ time: now, state: newState });
        return {
          started: true,
          time: now,
          state: newState,
          history: appState.history,
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

  return (
    <>
      <Chart history={appState.history} />
      <button onClick={() => updateState((state) => upPressed(state))}>
        UP
      </button>
    </>
  );
};

function Chart(props: { history: History<Sample> }) {
  const { data, ticks } = calculateLineChart(props.history);
  return (
    <LineChart width={1000} height={800} data={data}>
      <Line dataKey={"y"} type={"natural"} />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis
        dataKey={"time"}
        type={"number"}
        unit={"s"}
        domain={["dataMin", "dataMax"]}
        ticks={ticks}
        tickFormatter={(time) => Math.round(time).toString()}
      />
      <YAxis
        dataKey={"y"}
        hide={true}
        type={"number"}
        domain={["dataMin", "dataMax"]}
      />
    </LineChart>
  );
}

function calculateLineChart(history: History<Sample>): {
  data: Array<{ time: number; y: number }>;
  ticks: Array<number>;
} {
  let minTime = Number.MAX_VALUE;
  let maxTime = Number.MIN_VALUE;
  const data = history.get().map((sample: Sample) => {
    const time = sample.time / 1000;
    const y = sample.state.position;
    if (time > maxTime) {
      maxTime = time;
    }
    if (time < minTime) {
      minTime = time;
    }
    return {
      time,
      y,
    };
  });
  minTime = Math.ceil(minTime);
  maxTime = Math.floor(maxTime);
  let tick = minTime;
  let ticks: Array<number> = [];
  while (tick <= maxTime) {
    ticks.push(tick);
    tick++;
  }
  return { data, ticks };
}
