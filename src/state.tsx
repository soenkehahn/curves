export type State = {
  position: number;
  velocity: number;
};

export function newState(): State {
  return {
    position: 0,
    velocity: 1,
  };
}

export function update(timeDelta: number, state: State): State {
  return {
    ...state,
    position: state.position + timeDelta * state.velocity,
  };
}
