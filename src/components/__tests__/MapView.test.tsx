import React from "react";
import { render } from "@testing-library/react-native";
import { MapView } from "../MapView";

// Explicitly mock native modules for test reliability
jest.mock("react-native-reanimated");
jest.mock("react-native-gesture-handler");
jest.mock("expo-image");

// Mock the constants that MapView depends on
jest.mock("@constants/map/mapData", () => ({
  islands: [
    {
      id: "alphabet",
      title: "islandAlphabetTitle",
      subtitle: "islandAlphabetSubtitle",
      x: 100,
      y: 100,
      size: "large",
      status: "unlocked",
      imageSource: "test-image.png",
    },
  ],
}));

// Mock the images constants
jest.mock("@constants/images/images", () => ({
  BackgroundImages: {
    screens: {
      main: "ocean-bg.png",
    },
  },
}));

// Mock the Island component using the correct path
jest.mock("../Island", () => ({
  Island: function IslandMock(props: any) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return React.createElement(
      "View",
      props,
      React.createElement("Text", null, props.title),
    );
  },
}));

describe("MapView", () => {
  it("renders without crashing", () => {
    const { root } = render(<MapView />);
    expect(root).toBeDefined();
  });

  it("renders with proper structure", () => {
    const { getByText } = render(<MapView />);
    // Should render at least one island
    expect(getByText("islandAlphabetTitle")).toBeDefined();
  });
});
