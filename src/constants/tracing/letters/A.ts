import { Segment } from "@/src/types/common";

export const A: Segment[] = [
  // Left leg of A
  {
    points: [
      { x: 0.25, y: 0.80 },
      { x: 0.50, y: 0.20 }
    ],
    isCritical: true
  },
  // Right leg of A
  {
    points: [
      { x: 0.50, y: 0.20 },
      { x: 0.75, y: 0.80 }
    ]
  },
  // Crossbar of A
  {
    points: [
      { x: 0.38, y: 0.55 },
      { x: 0.62, y: 0.55 }
    ],
    isCritical: true
  }
];