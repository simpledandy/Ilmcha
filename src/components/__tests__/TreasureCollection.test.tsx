import React from "react";
import { render } from "@testing-library/react-native";
import { TreasureCollection } from "../TreasureCollection";

describe("TreasureCollection", () => {
  const defaultProps = {
    treasures: [
      { id: "1", name: "Gold Coin", rarity: "common" },
      { id: "2", name: "Silver Coin", rarity: "rare" },
    ],
    onTreasurePress: jest.fn(),
    isVisible: true,
    onClose: jest.fn(),
  };

  it("renders without crashing", () => {
    const { getByText } = render(<TreasureCollection {...defaultProps} />);
    expect(getByText("Gold Coin")).toBeTruthy();
  });

  it("shows empty state if no treasures", () => {
    const { getByText } = render(
      <TreasureCollection isVisible={true} onClose={jest.fn()} />,
    );
    expect(getByText(/no treasures/i)).toBeTruthy();
  });
});
