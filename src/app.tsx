import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { History, newHistory } from "./history";
import { Button, buttonPressed, newState, State, update } from "./state";

type AppState = {
  started: boolean;
  time: DOMHighResTimeStamp;
  state: State;
  history: History<Sample>;
};

type Sample = { time: DOMHighResTimeStamp; state: State };

export const App = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const state = newState(0.05);
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
        const newState = update(timeDelta / 1000, appState.state);
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
      <Chart
        f={(state: State) => state.position}
        history={appState.history}
        stroke="#00f"
      />
      <Chart
        f={(state: State) => state.velocity}
        history={appState.history}
        stroke="#f00"
      />
      {(["UP", "LEVEL", "DOWN"] as Array<Button>).map((b: Button) => (
        <div key={b}>
          <button
            onClick={() => updateState((state) => buttonPressed(state, b))}
          >
            {b}
          </button>
          <br />
        </div>
      ))}
    </>
  );
};

function Chart(props: {
  f: (state: State) => number;
  history: History<Sample>;
  stroke: string;
}) {
  const { data, timeTicks, yTicks } = calculateLineChart(
    props.f,
    props.history
  );
  return (
    <LineChart width={1000} height={400} data={data}>
      <CartesianGrid stroke="#ccc" />
      <Line dataKey={"y"} type={"natural"} stroke={props.stroke} />
      <XAxis
        dataKey={"time"}
        hide={true}
        type={"number"}
        domain={["dataMin", "dataMax"]}
        ticks={timeTicks}
        interval={0}
      />
      <YAxis
        dataKey={"y"}
        hide={true}
        type={"number"}
        domain={["dataMin", "dataMax"]}
        ticks={yTicks}
        interval={0}
      />
    </LineChart>
  );
}

function calculateLineChart(
  f: (state: State) => number,
  history: History<Sample>
): {
  data: Array<{ time: number; y: number }>;
  timeTicks: Array<number>;
  yTicks: Array<number>;
} {
  let minTime = Number.MAX_VALUE;
  let maxTime = Number.MIN_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;
  const data = history.get().map((sample: Sample) => {
    const time = sample.time / 1000;
    const y = f(sample.state);
    if (time > maxTime) {
      maxTime = time;
    }
    if (time < minTime) {
      minTime = time;
    }
    if (y > maxY) {
      maxY = y;
    }
    if (y < minY) {
      minY = y;
    }
    return {
      time,
      y,
    };
  });
  return {
    data,
    timeTicks: calculateTicks(minTime, maxTime),
    yTicks: calculateTicks(minY, maxY),
  };
}

function calculateTicks(min: number, max: number): Array<number> {
  min = Math.ceil(min);
  max = Math.floor(max);
  let tick = min;
  const ticks: Array<number> = [];
  while (tick <= max) {
    ticks.push(tick);
    tick++;
  }
  return ticks;
}
