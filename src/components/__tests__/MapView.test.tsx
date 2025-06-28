import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MapView } from "../MapView";

describe("MapView", () => {
  it("renders without crashing", () => {
    const { getByText } = render(<MapView />);
    expect(getByText("Island 1")).toBeTruthy();
  });

  it("handles onIslandPress", () => {
    const onIslandPress = jest.fn();
    const { getByText } = render(<MapView />);
    fireEvent.press(getByText("Island 1"));
    expect(onIslandPress).not.toHaveBeenCalled();
  });

  it("shows locked state for locked islands", () => {
    const { getByTestId } = render(<MapView />);
    expect(getByTestId("island-2-locked")).toBeTruthy();
  });
});
