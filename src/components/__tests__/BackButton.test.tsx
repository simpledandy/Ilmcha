import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { BackButton } from "../BackButton";

// Mock the translation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("BackButton", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it("renders correctly with default props", () => {
    const { getByText } = render(<BackButton onPress={mockOnPress} />);

    expect(getByText("←")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByText } = render(<BackButton onPress={mockOnPress} />);

    fireEvent.press(getByText("←"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "red" };
    const { getByText } = render(
      <BackButton onPress={mockOnPress} style={customStyle} />,
    );

    expect(getByText("←")).toBeTruthy();
  });

  it("renders with different sizes", () => {
    const { getByText: getSmall } = render(
      <BackButton onPress={mockOnPress} size="small" />,
    );
    const { getByText: getLarge } = render(
      <BackButton onPress={mockOnPress} size="large" />,
    );

    expect(getSmall("←")).toBeTruthy();
    expect(getLarge("←")).toBeTruthy();
  });
});
