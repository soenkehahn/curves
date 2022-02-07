import expect from "expect";
import { describe, it } from "str";

import { calculateTicks } from "./app";

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
