import { Segment } from "@/src/types/common";

export const one: Segment[] = [
  // Top serif
  {
    points: [
      { x: 0.3, y: 0.3 },
      { x: 0.5, y: 0.1 }
    ]
  },
  // Vertical line
  {
    points: [
      { x: 0.5, y: 0.15 },
      { x: 0.5, y: 0.85 }
    ],
    isCritical: true
  },
  // Small base
  {
    points: [
      { x: 0.3, y: 0.85 },
      { x: 0.7, y: 0.85 }
    ]
  },
];