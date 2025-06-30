import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Island } from "../Island";

describe("Island", () => {
  const defaultProps = {
    titleKey: "islandTitle",
    subtitle: "Subtitle 1",
    status: "unlocked" as const,
    onPress: jest.fn(),
  };

  it("renders without crashing", () => {
    const { getByText } = render(<Island {...defaultProps} />);
    expect(getByText("islandTitle")).toBeTruthy();
  });

  it("handles onPress", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Island {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByTestId("island-islandTitle"));
    expect(onPress).toHaveBeenCalled();
  });

  it("shows locked state if applicable", () => {
    const { getByTestId } = render(
      <Island {...defaultProps} status={"locked"} />,
    );
    expect(getByTestId("island-islandTitle")).toBeTruthy();
  });
});
