export function wait(length: number) {
  return new Promise((resolve) => setTimeout(resolve, length * 1000));
}

export function trace<T>(t: T): T {
  console.log(`trace: ${t}`);
  return t;
}

export function assert(condition: boolean) {
  if (!condition) {
    throw `assertion failed`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function exhaustivenessCheck(param: never) {}

export const debug = (...args: Array<unknown>): void => {
  for (const arg of args) {
    console.log(JSON.stringify(arg, null, 2));
  }
};
