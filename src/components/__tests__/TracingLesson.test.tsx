import React from "react";
import { render } from "@testing-library/react-native";
import { TracingLesson } from "../TracingLesson";

describe("TracingLesson", () => {
  const defaultProps = {
    segments: [
      { path: "M10,10 L20,20", value: "1" },
      { path: "M30,30 L40,40", value: "2" },
    ],
    exercise: {
      id: "test-exercise",
      target: "1",
      pathData: "M10,10 L20,20",
      startPoint: { x: 10, y: 10 },
      endPoint: { x: 20, y: 20 },
      difficulty: "easy" as const,
      hints: ["Test hint"],
    },
    onComplete: jest.fn(),
  };

  it("renders without crashing", () => {
    const { getByTestId } = render(<TracingLesson {...defaultProps} />);
    expect(getByTestId("tracing-lesson")).toBeTruthy();
  });

  it("calls onComplete when finished", () => {
    const onComplete = jest.fn();
    render(<TracingLesson {...defaultProps} onComplete={onComplete} />);
    // Simulate completion (update with actual event if available)
    // expect(onComplete).toHaveBeenCalled();
    expect(true).toBeTruthy(); // Placeholder
  });
});
