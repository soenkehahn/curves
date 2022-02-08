import expect from "expect";
import { describe, it } from "str";

import { buttonDown, buttonRelease, newState, update } from "./state";

function step(message: string) {
  console.log(`STEP: ${message}`);
}

describe("state updates", () => {
  it("updates according to a given force", () => {
    step("Doesn't move when force is 0");
    let state = newState({ forceConstant: 1 });
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

  it("reacts to ui interactions", () => {
    step("no interaction");
    let state = newState({ forceConstant: 0.7 });
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

  describe("resources", () => {
    it("depletes resources when moving", () => {
      step("before moving");
      let state = newState({ forceConstant: 1 });
      expect(state.resources).toEqual(100);
      step("when moving");
      const oldState = state;
      state.force = 0.7;
      state = update(0.1, state);
      expect(state.resources).toEqual(
        100 - Math.abs(state.position - oldState.position)
      );
    });

    it("depletes resources when moving down", () => {
      let state = newState({ forceConstant: 1 });
      const oldState = state;
      state.force = -0.7;
      state = update(0.1, state);
      expect(state.resources).toEqual(
        oldState.resources - Math.abs(state.position - oldState.position)
      );
    });

    it("cannot move when resources are depleted", () => {
      step("cannot move");
      let state = newState({ forceConstant: 0.7, resources: 0 });
      state = buttonDown("UP")(state);
      state = update(0.1, state);
      expect(state.position).toEqual(0);
      step("velocity can still be modified");
      expect(state.force).toEqual(0.7);
      expect(state.velocity).toEqual(0.1 * 0.7);
    });

    it("never moves without resources", () => {
      let state = newState({ forceConstant: 1, resources: 0.1 });
      state.force = 0.7;
      state = update(1, state);
      expect(state.position).toEqual(0.1);
    });
  });
});
