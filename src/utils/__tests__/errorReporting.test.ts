jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
    Version: 33,
    constants: { systemName: "Android" },
  },
}));

import {
  errorReporter,
  captureError,
  initializeErrorReporting,
} from "../errorReporting";

describe("errorReporting utility", () => {
  it("should be a singleton", () => {
    const instance1 = errorReporter;
    const instance2 = errorReporter;
    expect(instance1).toBe(instance2);
  });

  it("should initialize without error", () => {
    expect(() => initializeErrorReporting()).not.toThrow();
  });

  it("should capture an error without throwing", () => {
    const error = new Error("Test error");
    expect(() => captureError(error)).not.toThrow();
  });
});
