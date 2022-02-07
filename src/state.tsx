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

export function upPressed(state: State): State {
  return {
    ...state,
    force: 1,
  };
}
