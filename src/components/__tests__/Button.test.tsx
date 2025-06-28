import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../Button";

describe("Button", () => {
  it("renders without crashing", () => {
    const { getByText } = render(<Button onPress={() => {}}>Test</Button>);
    expect(getByText("Test")).toBeTruthy();
  });

  it("handles onPress", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Press me</Button>);
    fireEvent.press(getByText("Press me"));
    expect(onPress).toHaveBeenCalled();
  });

  it("applies variant prop", () => {
    const { getByText } = render(
      <Button onPress={() => {}} variant="secondary">
        Variant
      </Button>,
    );
    expect(getByText("Variant")).toBeTruthy();
  });

  it("shows loading state if applicable", () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} loading>
        Loading
      </Button>,
    );
    expect(getByTestId("button-loading")).toBeTruthy();
  });
});
