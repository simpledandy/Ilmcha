import { Segment } from "@/src/types/common";

export const five: Segment[] = [
  // Vertical
  {
    points: [
      { x: 0.4, y: 0.1 }, { x: 0.3, y: 0.5 },
    ],
    isCritical: true
  },
  // Lower bowl
  {
    points: [
      { x: 0.3, y: 0.5 },
      { x: 0.45, y: 0.45 },
      { x: 0.6, y: 0.45 },
      { x: 0.7, y: 0.6 },
      { x: 0.7, y: 0.75 },
      { x: 0.55, y: 0.9 },
      { x: 0.4, y: 0.9 },
      { x: 0.3, y: 0.8 }
    ],
    isCritical: true
  },
  // Top bar
  {
    points: [
      { x: 0.7, y: 0.1 }, { x: 0.4, y: 0.15 }
    ],
    isCritical: true
  },
];