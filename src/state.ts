import { debug, exhaustivenessCheck } from "./utils";
import * as v from "./value";
import { Value } from "./value";

type AllOptional<T> = {
  [Property in keyof T]+?: T[Property];
};

export type Config = {
  woodForceConstant: number;
  buildingForceConstant: number;
};

const defaultConfig: Config = {
  woodForceConstant: 1,
  buildingForceConstant: 1,
};

export type State = {
  wood: Value;
  building: Value;
};

export function newState(config: AllOptional<Config>): State {
  const c = { ...defaultConfig, ...config };
  return {
    wood: v.initialValue(c.woodForceConstant),
    building: v.initialValue(c.buildingForceConstant),
  };
}

export function update(timeDelta: number, old: State): State {
  const wood = v.update(timeDelta, old.wood);
  const building = v.update(timeDelta, old.building);
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
