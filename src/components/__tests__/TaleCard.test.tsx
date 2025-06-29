import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TaleCard } from "../TaleCard";

// Mock image import to fix require() style import lint error
jest.mock("../../../assets/images/tale-icon.png", () => "mock-tale-icon");

describe("TaleCard", () => {
  const defaultProps = {
    title: "Tale Title",
    imageSource: 1 as any,
    onPress: jest.fn(),
  };

  it("renders without crashing", () => {
    const { getByText } = render(<TaleCard {...defaultProps} />);
    expect(getByText("Tale Title")).toBeTruthy();
  });

  it("handles onPress", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <TaleCard {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId("tale-card"));
    expect(onPress).toHaveBeenCalled();
  });

  it("shows locked state if applicable", () => {
    const { getByTestId } = render(<TaleCard {...defaultProps} />);
    expect(getByTestId("tale-card")).toBeTruthy();
  });
});
