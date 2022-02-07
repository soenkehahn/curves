import { exhaustivenessCheck } from "./utils";

export type State = {
  position: number;
  velocity: number;
  force: number;
};

export function newState(): State {
  return {
    position: 0,
    velocity: 0,
    force: 0,
  };
}

export function update(timeDelta: number, state: State): State {
  const velocity = state.velocity + timeDelta * state.force;
  return {
    ...state,
    position: state.position + timeDelta * velocity,
    velocity,
  };
}

export type Button = "UP" | "LEVEL" | "DOWN";

export function buttonPressed(state: State, button: Button): State {
  let force = 0;
  switch (button) {
    case "UP": {
      force = 1;
      break;
    }
    case "LEVEL": {
      force = 0;
      break;
    }
    case "DOWN": {
      force = -1;
      break;
    }
    default:
      exhaustivenessCheck(button);
  }
  return {
    ...state,
    force,
  };
}
