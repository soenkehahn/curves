import expect from "expect";
import { describe, it } from "str";

import { calculateTicks, calculateLineChart } from "./app";
import { newHistory } from "./history";

describe("calculateTicks", () => {
  it("returns all integers between min and max", () => {
    expect(calculateTicks(3.5, 6.3)).toEqual([4, 5, 6]);
  });

  it("works for negative minimums", () => {
    expect(calculateTicks(-5.4, 6.3)).toEqual([
      -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6,
    ]);
  });

  it("works for negative maximums", () => {
    expect(calculateTicks(-15.4, -10.3)).toEqual([-15, -14, -13, -12, -11]);
  });
});

describe("calculateLineChart", () => {
  describe("yTicks", () => {
    it("works for positive numbers", () => {
      const history = newHistory<number>(100);
      for (const n of [3.5, 4.7, 4.8, 6.3]) {
        history.push({ time: performance.now(), state: n });
      }
      expect(calculateLineChart((x: number) => x, history).yTicks).toEqual([
        4, 5, 6,
      ]);
    });

    it("works for negative numbers", () => {
      const history = newHistory<number>(100);
      for (const n of [-5.5, -3.4, -2.3]) {
        history.push({ time: performance.now(), state: n });
      }
      expect(calculateLineChart((x: number) => x, history).yTicks).toEqual([
        -5, -4, -3,
      ]);
    });
  });
});
