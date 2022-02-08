import expect from "expect";
import { describe, it } from "str";

import { gridPosition } from "./grid";

describe("gridPosition", () => {
  it("works", () => {
    const cases = [
      {
        columns: 10,
        expected: [
          { gridColumn: 1, gridRow: 1 },
          { gridColumn: 2, gridRow: 1 },
          { gridColumn: 3, gridRow: 1 },
          { gridColumn: 4, gridRow: 1 },
          { gridColumn: 5, gridRow: 1 },
        ],
      },
      {
        columns: 5,
        expected: [
          { gridColumn: 1, gridRow: 1 },
          { gridColumn: 2, gridRow: 1 },
          { gridColumn: 3, gridRow: 1 },
          { gridColumn: 4, gridRow: 1 },
          { gridColumn: 5, gridRow: 1 },
        ],
      },
      {
        columns: 4,
        expected: [
          { gridColumn: 1, gridRow: 1 },
          { gridColumn: 2, gridRow: 1 },
          { gridColumn: 3, gridRow: 1 },
          { gridColumn: 4, gridRow: 1 },
          { gridColumn: 1, gridRow: 2 },
        ],
      },
      {
        columns: 2,
        expected: [
          { gridColumn: 1, gridRow: 1 },
          { gridColumn: 2, gridRow: 1 },
          { gridColumn: 1, gridRow: 2 },
          { gridColumn: 2, gridRow: 2 },
          { gridColumn: 1, gridRow: 3 },
        ],
      },
      {
        columns: 1,
        expected: [
          { gridColumn: 1, gridRow: 1 },
          { gridColumn: 1, gridRow: 2 },
          { gridColumn: 1, gridRow: 3 },
          { gridColumn: 1, gridRow: 4 },
          { gridColumn: 1, gridRow: 5 },
        ],
      },
    ];
    for (const c of cases) {
      console.log(`columns: ${c.columns}`);
      expect(
        [0, 1, 2, 3, 4].map((i) => gridPosition({ columns: c.columns, i }))
      ).toEqual(c.expected);
    }
  });
});
