import { newState, update } from "./state";
import { describe, it } from "str";
import expect from "expect";

describe("state updates", () => {
  it("updates according to a given velocity", () => {
    let state = newState();
    state.position = 1;
    state.velocity = 0.3;
    state = update(0.1, state);
    expect(state.position).toEqual(1 + 0.1 * 0.3);
  });
});
