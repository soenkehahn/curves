import * as React from "react";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { History, newHistory } from "./history";
import {
  Button,
  buttonDown,
  buttonRelease,
  newState,
  State,
  update,
} from "./state";
import { wait } from "./utils";

const config = {
  historySize: 500,
  tickDelay: null,
};

type AppState = {
  started: boolean;
  time: DOMHighResTimeStamp;
  state: State;
  history: History<Sample>;
};

type Sample = { time: DOMHighResTimeStamp; state: State };

export const App = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const state = newState(0.5);
    const history = newHistory<Sample>(config.historySize);
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
    async (now: DOMHighResTimeStamp) => {
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
      if (config.tickDelay) {
        await wait(config.tickDelay);
      }
      window.requestAnimationFrame(tick);
    },
    [setAppState]
  );

  useEffect(() => {
    if (!appState.started) {
      window.requestAnimationFrame(tick);
    }
  }, [appState]);

  const handleVelocityMouseEvent = (event: MouseEvent) => {
    let button: null | Button = null;
    if (event.button === 0) {
      button = "UP";
    } else if (event.button === 2) {
      button = "DOWN";
    }
    if (button) {
      if (event.type === "mousedown") {
        updateState(buttonDown(button));
      } else if (event.type === "mouseup") {
        updateState(buttonRelease(button));
      }
    }
  };

  return (
    <>
      <div
        onMouseDown={handleVelocityMouseEvent}
        onMouseUp={handleVelocityMouseEvent}
      >
        <Chart
          f={(state: State) => state.velocity}
          history={appState.history}
          stroke="#f00"
        />
      </div>
      <Chart
        f={(state: State) => state.position}
        history={appState.history}
        stroke="#00f"
      />
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
      <Line
        dataKey={"y"}
        stroke={props.stroke}
        isAnimationActive={false}
        dot={false}
      />
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

export function calculateTicks(min: number, max: number): Array<number> {
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
