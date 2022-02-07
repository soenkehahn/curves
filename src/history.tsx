export type History<T> = {
  push: (sample: { time: DOMHighResTimeStamp; state: T }) => void;
  get(): Array<{ time: DOMHighResTimeStamp; state: T }>;
  _history: Array<{ time: DOMHighResTimeStamp; state: T }>;
};

export function newHistory<T>(size: number): History<T> {
  const _history: Array<{ time: DOMHighResTimeStamp; state: T }> = [];
  return {
    push: (t: { time: DOMHighResTimeStamp; state: T }) => {
      _history.push(t);
      if (_history.length > size) {
        _history.shift();
      }
    },
    get: () => _history,
    _history: _history,
  };
}
