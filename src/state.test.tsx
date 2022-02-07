import { newState, update, upPressed } from "./state";
import { describe, it } from "str";
import expect from "expect";

function step(message: string) {
  console.log(`STEP: ${message}`);
}

describe("state updates", () => {
  it("updates according to a given force", () => {
    step("Doesn't move when force is 0");
    let state = newState();
    state.position = 1;
    state.velocity = 0;
    state.force = 0;
    state = update(0.1, state);
    expect(state.position).toEqual(1);
    step("Updates velocity");
    state.force = 3;
    state = update(0.1, state);
    const expectedVelocity = 0 + 3 * 0.1;
    expect(state.velocity).toEqual(expectedVelocity);
    step("Updates position");
    const expectedPosition = 1 + expectedVelocity * 0.1;
    expect(state.position).toEqual(expectedPosition);
    step("Done");
  });
});

it("reacts to ui interactions", () => {
  step("no interaction");
  let state = newState();
  expect(state.force).toEqual(0);
  step("when UP is pressed");
  state = upPressed(state);
  expect(state.force).toEqual(1);
});
