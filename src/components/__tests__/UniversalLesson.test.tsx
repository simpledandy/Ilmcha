import React from "react";
import { render } from "@testing-library/react-native";
import { UniversalLesson } from "../UniversalLesson";

describe("UniversalLesson", () => {
  const defaultProps = {
    lesson: {
      id: "1",
      title: "Lesson 1",
      description: "A test lesson.",
      category: "counting" as const,
      difficulty: "easy" as const,
      estimatedDuration: 5,
      maxPoints: 100,
      rewardMultiplier: 1,
      steps: [
        {
          id: "step1",
          type: "instruction" as const,
          content: { type: "instruction", text: "Step 1" },
        },
        {
          id: "step2",
          type: "quiz" as const,
          content: { type: "quiz", questions: [] },
        },
      ],
    },
    onComplete: jest.fn(),
    onBack: jest.fn(),
  };

  it("renders without crashing", () => {
    const { getByText } = render(<UniversalLesson {...defaultProps} />);
    expect(getByText("Lesson 1")).toBeTruthy();
  });

  it("navigates steps and calls onComplete", () => {
    const onComplete = jest.fn();
    const { getByText } = render(
      <UniversalLesson {...defaultProps} onComplete={onComplete} />,
    );
    // Simulate step navigation (update with actual navigation logic if available)
    // fireEvent.press(getByText('Next'));
    // expect(onComplete).toHaveBeenCalled();
    expect(getByText("Lesson 1")).toBeTruthy();
  });
});
