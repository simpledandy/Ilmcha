import { colors } from "../colors";
import { typography, textStyles } from "../typography";
import { inputVariants } from "../input";

describe("Theme Exports", () => {
  it("should export colors object with expected keys", () => {
    expect(colors).toBeDefined();
    expect(colors).toHaveProperty("primary");
    expect(colors).toHaveProperty("success");
    expect(colors).toHaveProperty("error");
    expect(colors).toHaveProperty("warning");
    expect(colors).toHaveProperty("text");
    expect(colors).toHaveProperty("background");
    expect(colors).toHaveProperty("input");
    expect(colors).toHaveProperty("button");
    expect(colors).toHaveProperty("common");
    expect(colors).toHaveProperty("rarity");
    expect(colors).toHaveProperty("overlay");
  });

  it("should export typography object with expected keys", () => {
    expect(typography).toBeDefined();
    expect(typography).toHaveProperty("fontFamily");
    expect(typography).toHaveProperty("fontSize");
    expect(typography).toHaveProperty("lineHeight");
    expect(typography).toHaveProperty("letterSpacing");
  });

  it("should export textStyles object with expected keys", () => {
    expect(textStyles).toBeDefined();
    expect(textStyles).toHaveProperty("heading1");
    expect(textStyles).toHaveProperty("heading2");
    expect(textStyles).toHaveProperty("heading3");
    expect(textStyles).toHaveProperty("body");
    expect(textStyles).toHaveProperty("bodyLarge");
    expect(textStyles).toHaveProperty("caption");
    expect(textStyles).toHaveProperty("button");
    expect(textStyles).toHaveProperty("label");
  });

  it("should export inputVariants object with only default variant", () => {
    expect(inputVariants).toBeDefined();
    expect(Object.keys(inputVariants)).toEqual(["default"]);
  });
});
