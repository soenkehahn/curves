import expect from "expect";
import { describe, it } from "str";

import { History, newHistory } from "./history";

describe("history", () => {
  it("allows to add new samples up to the given length", () => {
    const history: History<string> = newHistory(3);
    history.push({ time: performance.now(), state: "foo" });
    expect(history.get().map((x) => x.state)).toEqual(["foo"]);
    history.push({ time: performance.now(), state: "bar" });
    expect(history.get().map((x) => x.state)).toEqual(["foo", "bar"]);
    history.push({ time: performance.now(), state: "baz" });
    expect(history.get().map((x) => x.state)).toEqual(["foo", "bar", "baz"]);
    history.push({ time: performance.now(), state: "huhu" });
    expect(history.get().map((x) => x.state)).toEqual(["bar", "baz", "huhu"]);
  });
});
