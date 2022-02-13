import { exhaustivenessCheck } from "./utils";
import * as v from "./value";
import { Value } from "./value";

type AllOptional<T> = {
  [Property in keyof T]+?: T[Property];
};

export type Config = {
  woodForceConstant: number;
  buildingForceConstant: number;
  maxMining: number;
};

const defaultConfig: Config = {
  woodForceConstant: 1,
  buildingForceConstant: 1,
  maxMining: Number.MAX_SAFE_INTEGER,
};

export type State = {
  wood: Value;
  building: Value;
  config: {
    maxMining: number;
  };
};

export function newState(config: AllOptional<Config>): State {
  const c = { ...defaultConfig, ...config };
  return {
    wood: v.initialValue(c.woodForceConstant),
    building: v.initialValue(c.buildingForceConstant),
    config: c,
  };
}

export function update(timeDelta: number, old: State): State {
  let wood = old.wood;
  let building = old.building;
  wood = v.updateVelocity(timeDelta, old.wood);
  if (building.velocity + wood.velocity > old.config.maxMining) {
    building.velocity = old.config.maxMining - wood.velocity;
  }
  building = v.updateVelocity(timeDelta, old.building);
  if (building.velocity + wood.velocity > old.config.maxMining) {
    wood.velocity = old.config.maxMining - building.velocity;
  }
  wood = v.updatePosition(timeDelta, wood);
  building = v.updatePosition(timeDelta, building);
  building.position = Math.min(
    building.position,
    old.building.position + wood.position
  );
  wood.position -= building.position - old.building.position;
  wood.position = Math.max(wood.position, 0);
  return { ...old, wood, building };
}

export type Button = "UP" | "DOWN";

export const handleButton =
  (button: Button, event: "press" | "release", value: "wood" | "building") =>
  (state: State): State => {
    switch (value) {
      case "wood": {
        return {
          ...state,
          wood: v.changeForce(button, event, state.wood),
        };
      }
      case "building": {
        return {
          ...state,
          building: v.changeForce(button, event, state.building),
        };
      }
      default:
        exhaustivenessCheck(value);
        throw "impossible";
    }
  };
