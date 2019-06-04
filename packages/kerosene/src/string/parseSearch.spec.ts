import parseSearch from "./parseSearch";

describe("#parseSearch", () => {
  it("should return an empty object when search is empty", () => {
    expect(parseSearch("")).toEqual({});
  });

  it("should correctly parse a search", () => {
    expect(parseSearch("?key=value&arr=0&arr=1")).toEqual({
      key: "value",
      arr: ["0", "1"],
    });
  });
});
