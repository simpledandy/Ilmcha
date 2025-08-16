import { Segment } from "@/src/types/common";

export const four: Segment[] = [
  // Diagonal
  {
    points: [
      { x: 0.25, y: 0.7 },
      { x: 0.55, y: 0.2 }
    ],
    isCritical: true
  },
  // Horizontal
  {
    points: [
      { x: 0.3, y: 0.7 },
      { x: 0.7, y: 0.7 }
    ],
    isCritical: true
  },
  // Vertical
  {
    points: [
      { x: 0.6, y: 0.2 },
      { x: 0.6, y: 0.85 }
    ],
    isCritical: true
  },
];