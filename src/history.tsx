export type History<T> = {
  append: (t: T) => void;
  get(): Array<T>;
  _history: Array<T>;
};

export function newHistory<T>(size: number): History<T> {
  const _history: Array<T> = [];
  return {
    append: (t: T) => {
      _history.push(t);
      if (_history.length > size) {
        _history.shift();
      }
    },
    get: () => _history,
    _history: _history,
  };
}
