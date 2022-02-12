import { Button } from "./state";
import { exhaustivenessCheck } from "./utils";

export type Value = {
  position: number;
  velocity: number;
  force: number;
  forceConstant: number;
};

export const initialValue = (forceConstant: number): Value => ({
  position: 0,
  velocity: 0,
  force: 0,
  forceConstant,
});

export const update = (timeDelta: number, value: Value): Value => {
  const velocity = Math.max(0, value.velocity + timeDelta * value.force);
  const positionChange = timeDelta * velocity;
  return {
    ...value,
    position: value.position + positionChange,
    velocity,
  };
};

export const changeForce = (
  button: Button,
  event: "press" | "release",
  value: Value
) => {
  const forceChange =
    button === "UP" ? value.forceConstant : -value.forceConstant;
  switch (event) {
    case "press": {
      return {
        ...value,
        force: value.force + forceChange,
      };
    }
    case "release": {
      return {
        ...value,
        force: value.force - forceChange,
      };
    }
    default:
      exhaustivenessCheck(event);
      throw "impossible";
  }
};
