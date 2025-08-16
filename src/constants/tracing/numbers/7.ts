import { Segment } from "@/src/types/common";

export const seven: Segment[] = [
  // Top bar
  {
    points: [
      { x: 0.3, y: 0.15 },
      { x: 0.7, y: 0.15 }
    ],
    isCritical: true
  },
  // Diagonal
  {
    points: [
      { x: 0.7, y: 0.15 },
      { x: 0.4, y: 0.85 }
    ]
  },
  {
    points: [
      { x: 0.4, y: 0.5 },
      { x: 0.7, y: 0.5 }
    ]
  }
];