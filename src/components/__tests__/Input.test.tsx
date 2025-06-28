import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Input } from "../Input";

describe("Input", () => {
  it("renders without crashing", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Type here" value="" onChangeText={() => {}} />,
    );
    expect(getByPlaceholderText("Type here")).toBeTruthy();
  });

  it("handles value and onChangeText", () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Type here"
        value="test"
        onChangeText={onChangeText}
      />,
    );
    fireEvent.changeText(getByPlaceholderText("Type here"), "new value");
    expect(onChangeText).toHaveBeenCalledWith("new value");
  });

  it("shows error state if applicable", () => {
    const { getByText } = render(
      <Input
        placeholder="Type here"
        value=""
        onChangeText={() => {}}
        error="Error!"
      />,
    );
    expect(getByText("Error!")).toBeTruthy();
  });
});
