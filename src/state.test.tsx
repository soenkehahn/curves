import expect from "expect";
import { describe, it } from "str";

import { buttonDown, buttonRelease, newState, update } from "./state";

function step(message: string) {
  console.log(`STEP: ${message}`);
}

describe("state updates", () => {
  it("updates according to a given force", () => {
    step("Doesn't move when force is 0");
    let state = newState(1);
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
  let state = newState(0.7);
  expect(state.force).toEqual(0);
  step("when UP is pressed");
  state = buttonDown("UP")(state);
  expect(state.force).toEqual(0.7);
  step("when UP is released");
  state = buttonRelease("UP")(state);
  expect(state.force).toEqual(0);
  step("when DOWN is pressed");
  state = buttonDown("DOWN")(state);
  expect(state.force).toEqual(-0.7);
  step("when DOWN is released");
  state = buttonRelease("DOWN")(state);
  expect(state.force).toEqual(0);

  step("when UP *and* DOWN are pressed");
  state = buttonDown("UP")(state);
  state = buttonDown("DOWN")(state);
  expect(state.force).toEqual(0);
  step("when UP is released but DOWN is still pressed");
  state = buttonRelease("UP")(state);
  expect(state.force).toEqual(-0.7);
  step("when DOWN is also released");
  state = buttonRelease("DOWN")(state);
  expect(state.force).toEqual(0);
});
