export type State = { time: DOMHighResTimeStamp };

export function newState(): State {
  return { time: 0 };
}

export function update(timeDelta: number, state: State): State {
  return { time: state.time + timeDelta };
}
