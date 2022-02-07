import expect from "expect";
import { describe, it } from "str";

import { History, newHistory } from "./history";

describe("history", () => {
  it("allows to add new samples up to the given length", () => {
    const history: History<string> = newHistory(3);
    history.append("foo");
    expect(history.get()).toEqual(["foo"]);
    history.append("bar");
    expect(history.get()).toEqual(["foo", "bar"]);
    history.append("baz");
    expect(history.get()).toEqual(["foo", "bar", "baz"]);
    history.append("huhu");
    expect(history.get()).toEqual(["bar", "baz", "huhu"]);
  });
});
