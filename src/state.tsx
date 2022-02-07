export type State = {
  position: number;
  velocity: number;
  force: number;
  forceConstant: number;
};

export function newState(forceConstant: number): State {
  return {
    position: 0,
    velocity: 0,
    force: 0,
    forceConstant,
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
  b === "UP" ? s.forceConstant : -s.forceConstant;
