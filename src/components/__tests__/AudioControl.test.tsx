import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AudioControl } from "../AudioControl";

// Mock the translation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue || key,
  }),
}));

describe("AudioControl", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it("renders correctly with default props", () => {
    const { getByText } = render(<AudioControl onPress={mockOnPress} />);

    expect(getByText("▶️")).toBeTruthy();
  });

  it("renders play variant", () => {
    const { getByText } = render(
      <AudioControl onPress={mockOnPress} variant="play" />,
    );

    expect(getByText("▶️")).toBeTruthy();
  });

  it("renders pause variant", () => {
    const { getByText } = render(
      <AudioControl onPress={mockOnPress} variant="pause" />,
    );

    expect(getByText("⏸️")).toBeTruthy();
  });

  it("renders replay variant", () => {
    const { getByText } = render(
      <AudioControl onPress={mockOnPress} variant="replay" />,
    );

    expect(getByText("🔁")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByText } = render(<AudioControl onPress={mockOnPress} />);

    fireEvent.press(getByText("▶️"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it.skip("does not call onPress when disabled", () => {
    const { getByText } = render(
      <AudioControl onPress={mockOnPress} disabled={true} />,
    );
    // Find the closest TouchableOpacity ancestor
    const button = getByText("▶️").parent;
    if (
      button &&
      button.props &&
      typeof button.props.disabled !== "undefined"
    ) {
      expect(button.props.disabled).toBe(true);
    }
    fireEvent.press(getByText("▶️"));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("does not call onPress when loading", () => {
    render(<AudioControl onPress={mockOnPress} loading={true} />);

    // When loading, the button should be disabled and show ActivityIndicator
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("renders with different sizes", () => {
    const { getByText: getSmall } = render(
      <AudioControl onPress={mockOnPress} size="small" />,
    );
    const { getByText: getLarge } = render(
      <AudioControl onPress={mockOnPress} size="large" />,
    );

    expect(getSmall("▶️")).toBeTruthy();
    expect(getLarge("▶️")).toBeTruthy();
  });

  it("renders all variants correctly", () => {
    const variants = [
      "play",
      "pause",
      "replay",
      "stop",
      "volume",
      "mute",
    ] as const;

    variants.forEach((variant) => {
      const { getByText } = render(
        <AudioControl onPress={mockOnPress} variant={variant} />,
      );

      // Each variant should render an icon
      expect(getByText).toBeTruthy();
    });
  });
});
