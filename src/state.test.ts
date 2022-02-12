import expect from "expect";
import { describe, it } from "str";

import { handleButton as handleButton, newState, update } from "./state";
import { debug } from "./utils";

function step(message: string) {
  console.log(`STEP: ${message}`);
}

describe("state updates", () => {
  it("reacts to ui interactions", () => {
    step("no interaction");
    let state = newState({ woodForceConstant: 0.7 });
    expect(state.wood.force).toEqual(0);
    step("when UP is pressed");
    state = handleButton("UP", "press", "wood")(state);
    expect(state.wood.force).toEqual(0.7);
    step("when UP is released");
    state = handleButton("UP", "release", "wood")(state);
    expect(state.wood.force).toEqual(0);
    step("when DOWN is pressed");
    state = handleButton("DOWN", "press", "wood")(state);
    expect(state.wood.force).toEqual(-0.7);
    step("when DOWN is released");
    state = handleButton("DOWN", "release", "wood")(state);
    expect(state.wood.force).toEqual(0);
    step("when UP *and* DOWN are pressed");
    state = handleButton("UP", "press", "wood")(state);
    state = handleButton("DOWN", "press", "wood")(state);
    expect(state.wood.force).toEqual(0);
    step("when UP is released but DOWN is still pressed");
    state = handleButton("UP", "release", "wood")(state);
    expect(state.wood.force).toEqual(-0.7);
    step("when DOWN is also released");
    state = handleButton("DOWN", "release", "wood")(state);
    expect(state.wood.force).toEqual(0);
  });

  it("updates according to a given force", () => {
    step("Doesn't move when force is 0");
    let state = newState({ woodForceConstant: 1 });
    state.wood.position = 1;
    state.wood.velocity = 0;
    state.wood.force = 0;
    state = update(0.1, state);
    expect(state.wood.position).toEqual(1);
    step("Updates velocity");
    state.wood.force = 3;
    state = update(0.1, state);
    const expectedVelocity = 0 + 3 * 0.1;
    expect(state.wood.velocity).toEqual(expectedVelocity);
    step("Updates position");
    const expectedPosition = 1 + expectedVelocity * 0.1;
    expect(state.wood.position).toEqual(expectedPosition);
    step("Done");
  });

  it("Doesn't move down when velocity is negative", () => {
    step("Doesn't move down when velocity is negative");
    let state = newState({ woodForceConstant: 1 });
    state.wood.position = 0;
    state.wood.velocity = 0;
    state.wood.force = -1;
    state = update(0.1, state);
    expect(state.wood.position).toEqual(0);
  });

  it("allows to ramp up building", () => {
    let state = newState({ woodForceConstant: 1, buildingForceConstant: 4 });
    state.wood.position = 10;
    step("increasing building");
    state = handleButton("UP", "press", "building")(state);
    state = update(1, state);
    state = handleButton("UP", "release", "building")(state);
    state = update(1, state);
    expect(state.building.position).toEqual(8);
    step("building costs wood");
    expect(state.wood.position).toEqual(2);
    step("building requires wood");
    state = update(1, state);
    expect(state.wood.position).toEqual(0);
    expect(state.building.position).toEqual(10);
  });

  it("lets building grow as much as wood", () => {
    let state = newState({});
    state.wood.velocity = 5;
    state.building.velocity = 4;
    state = update(1, state);
    expect(state.wood.position).toEqual(1);
    expect(state.building.position).toEqual(4);
  });

  it("lets building grow as much as wood", () => {
    let state = newState({});
    state.wood.velocity = 3;
    state.building.velocity = 4;
    state = update(1, state);
    expect(state.wood.position).toEqual(0);
    expect(state.building.position).toEqual(3);
  });
});
