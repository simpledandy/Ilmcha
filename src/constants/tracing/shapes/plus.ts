import { Segment } from "@/src/types/common";

export const plus: Segment[] = [
  // Vertical
  {
    points: [
      { x: 0.5, y: 0.2 },
      { x: 0.5, y: 0.8 }
    ],
    isCritical: true
  },
  // Horizontal
  {
    points: [
      { x: 0.2, y: 0.5 },
      { x: 0.8, y: 0.5 }
    ]
  }
];