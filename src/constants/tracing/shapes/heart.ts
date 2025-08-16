import { Segment } from "@/src/types/common";

export const heart: Segment[] = [
  // Left curve
  {
    points: [
    { x: 0.5, y: 0.3 }, { x: 0.4, y: 0.2 },
    { x: 0.3, y: 0.2 }, { x: 0.2, y: 0.25 }, { x: 0.15, y: 0.35 },
    { x: 0.2, y: 0.5 }, { x: 0.5, y: 0.9 },
    ],
    isCritical: true
  },
  // Right curve
  {
    points: [
      { x: 0.5, y: 0.3 }, { x: 0.6, y: 0.2 },
      { x: 0.7, y: 0.2 }, { x: 0.8, y: 0.25 }, { x: 0.85, y: 0.35 },
      { x: 0.8, y: 0.5 }, 
      { x: 0.5, y: 0.9 }
    ],
    isCritical: true
  }
];