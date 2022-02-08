export type Config = {
  forceConstant: number;
  resources?: number;
};

export type State = {
  position: number;
  velocity: number;
  force: number;
  config: Config;
  resources: number;
};

export function newState(config: Config): State {
  return {
    position: 0,
    velocity: 0,
    force: 0,
    config,
    resources: config.resources == undefined ? 100 : config.resources,
  };
}

export function update(timeDelta: number, state: State): State {
  const velocity = state.velocity + timeDelta * state.force;
  const positionChange =
    Math.min(state.resources, Math.abs(timeDelta * velocity)) *
    Math.sign(velocity);
  positionChange;
  return {
    ...state,
    velocity,
    position: state.position + positionChange,
    resources: state.resources - Math.abs(positionChange),
  };
}

export type Button = "UP" | "DOWN";

export const buttonDown =
  (button: Button) =>
  (state: State): State => ({
    ...state,
    force: state.force + forceChange(button, state),
  });

export const buttonRelease =
  (button: Button) =>
  (state: State): State => ({
    ...state,
    force: state.force - forceChange(button, state),
  });

const forceChange = (b: Button, s: State): number =>
  b === "UP" ? s.config.forceConstant : -s.config.forceConstant;
