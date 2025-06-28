import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Island } from "../Island";

describe("Island", () => {
  const defaultProps = {
    title: "Island 1",
    subtitle: "Subtitle 1",
    status: "unlocked" as const,
    onPress: jest.fn(),
  };

  it("renders without crashing", () => {
    const { getByText } = render(<Island {...defaultProps} />);
    expect(getByText("Island 1")).toBeTruthy();
  });

  it("handles onPress", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Island {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId("island-1"));
    expect(onPress).toHaveBeenCalledWith("1");
  });

  it("shows locked state if applicable", () => {
    const { getByTestId } = render(
      <Island {...defaultProps} status={"locked"} />,
    );
    expect(getByTestId("island-1")).toBeTruthy();
  });
});
