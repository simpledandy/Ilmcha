import { Segment } from "@/src/types/common";

export const diamond: Segment[] = [
  // Top to right
  {
    points: [
      { x: 0.5, y: 0.1 },
      { x: 0.9, y: 0.5 }
    ],
    isCritical: true
  },
  // Right to bottom
  {
    points: [
      { x: 0.9, y: 0.5 },
      { x: 0.5, y: 0.9 }
    ]
  },
  // Bottom to left
  {
    points: [
      { x: 0.5, y: 0.9 },
      { x: 0.1, y: 0.5 }
    ],
    isCritical: true
  },
  // Left to top
  {
    points: [
      { x: 0.1, y: 0.5 },
      { x: 0.5, y: 0.1 }
    ]
  }
];