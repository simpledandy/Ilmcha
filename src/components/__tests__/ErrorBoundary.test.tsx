import React from "react";
import { render } from "@testing-library/react-native";
import { ErrorBoundary } from "../ErrorBoundary";
import { Text } from "../Text";

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Child</Text>
      </ErrorBoundary>,
    );
    expect(getByText("Child")).toBeTruthy();
  });

  it("shows fallback UI on error", () => {
    const ProblemChild = () => {
      throw new Error("Test error");
    };
    const { getByText } = render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );
    expect(getByText(/something went wrong/i)).toBeTruthy();
  });
});
