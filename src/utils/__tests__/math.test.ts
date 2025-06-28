import { clamp } from "../math";

describe("clamp", () => {
  it("returns the value if within range", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });
  it("returns the min if value is below range", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
  });
  it("returns the max if value is above range", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
