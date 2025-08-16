import { Segment } from "@/src/types/common";

export const triangle: Segment[] = [
  // Top to right
  {
    points: [
      { x: 0.5, y: 0.1 },
      { x: 0.9, y: 0.9 }
    ],
    isCritical: true
  },
  // Right to left
  {
    points: [
      { x: 0.9, y: 0.9 },
      { x: 0.1, y: 0.9 }
    ]
  },
  // Left to top
  {
    points: [
      { x: 0.1, y: 0.9 },
      { x: 0.5, y: 0.1 }
    ],
    isCritical: true
  }
];