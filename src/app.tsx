import * as React from "react";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Grid } from "./grid";
import { History, newHistory } from "./history";
import { Button, handleButton, newState, State, update } from "./state";
import * as state from "./state";
import { wait } from "./utils";

const config = {
  historySize: 500,
  tickDelay: null,
};

type AppState = {
  started: boolean;
  time: DOMHighResTimeStamp;
  state: State;
  history: History<State>;
};

const stateConfig: state.Config = {
  woodForceConstant: 0.5,
  buildingForceConstant: 1,
  maxMining: 4,
};

export const App = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const state = newState(stateConfig);
    const history = newHistory<State>(config.historySize);
    const now = performance.now();
    history.push({ time: now, state });
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
        appState.history.push({ time: now, state: newState });
        return {
          started: true,
          time: now,
          state: newState,
          history: appState.history,
        };
      });
      if (config.tickDelay != null) {
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

  return (
    <Grid columns={2}>
      <Chart
        f={(state: State) => state.wood.velocity}
        history={appState.history}
        stroke="#f00"
        updateState={updateState}
        value="wood"
      />
      <Chart
        f={(state: State) => state.wood.position}
        history={appState.history}
        stroke="#00f"
        updateState={updateState}
      />
      <Chart
        f={(state: State) => state.building.velocity}
        history={appState.history}
        stroke="#0f0"
        updateState={updateState}
        value="building"
      />
      <Chart
        f={(state: State) => state.building.position}
        history={appState.history}
        stroke="#ff0"
        updateState={updateState}
      />
    </Grid>
  );
};

function Chart(props: {
  f: (state: State) => number;
  history: History<State>;
  stroke: string;
  updateState: (update: (state: State) => State) => void;
  value?: "wood" | "building";
}) {
  const handleVelocityMouseEvent =
    (value: "wood" | "building") =>
    (event: MouseEvent): void => {
      let button: null | Button = null;
      if (event.button === 0) {
        button = "UP";
      } else if (event.button === 2) {
        button = "DOWN";
      }
      if (button) {
        if (event.type === "mousedown") {
          props.updateState(handleButton(button, "press", value));
        } else if (event.type === "mouseup") {
          props.updateState(handleButton(button, "release", value));
        }
      }
    };
  let mouseHandlers = {};
  if (props.value != null) {
    mouseHandlers = {
      onMouseDown: handleVelocityMouseEvent(props.value),
      onMouseUp: handleVelocityMouseEvent(props.value),
    };
  }

  const { data, timeTicks, yTicks } = calculateLineChart(
    props.f,
    props.history
  );

  return (
    <div
      {...mouseHandlers}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <Line
            dataKey={"y"}
            stroke={props.stroke}
            isAnimationActive={false}
            dot={false}
            strokeWidth={2}
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
      </ResponsiveContainer>
    </div>
  );
}

export function calculateLineChart<T>(
  f: (state: T) => number,
  history: History<T>
): {
  data: Array<{ time: number; y: number }>;
  timeTicks: Array<number>;
  yTicks: Array<number>;
} {
  let minTime = Number.MAX_SAFE_INTEGER;
  let maxTime = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  const data = history
    .get()
    .map((sample: { time: DOMHighResTimeStamp; state: T }) => {
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
    yTicks: calculateTicks(Math.min(0, minY), Math.max(0, maxY)),
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
