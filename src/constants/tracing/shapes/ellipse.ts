import { Segment } from "@/src/types/common";

export const ellipse: Segment[] = [
  // Right curve
  {
    points: [
      { x: 0.5, y: 0.3 }, { x: 0.3, y: 0.32 },
      { x: 0.25, y: 0.35 }, { x: 0.2, y: 0.37 },
      { x: 0.15, y: 0.5 }, { x: 0.2, y: 0.62 },
      { x: 0.25, y: 0.65 }, { x: 0.3, y: 0.67 },
      { x: 0.5, y: 0.7 }, { x: 0.7, y: 0.67 },
      { x: 0.75, y: 0.65 }, { x: 0.8, y: 0.62 },
      { x: 0.85, y: 0.5 }, { x: 0.8, y: 0.37 },
      { x: 0.75, y: 0.35 }, { x: 0.7, y: 0.32 },
      { x: 0.5, y: 0.3 }
    ],
    isCritical: true
  },
];