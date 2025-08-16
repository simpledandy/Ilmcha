import { Segment } from "@/src/types/common";

export const G: Segment[] = [
  {
    points: [
      // Top curve
      { x: 0.65, y: 0.3 }, { x: 0.6, y: 0.2 },
      { x: 0.4, y: 0.2 }, { x: 0.3, y: 0.3 },
      // Left top to bottom
      { x: 0.25, y: 0.4 }, { x: 0.25, y: 0.6 },
      // Bottom curve
      { x: 0.3, y: 0.7 }, { x: 0.4, y: 0.8 },
      { x: 0.6, y: 0.8 }, { x: 0.7, y: 0.7 },
      // Right side and crossbar
      { x: 0.7, y: 0.7 }, { x: 0.7, y: 0.5 },
      { x: 0.5, y: 0.5 }
    ],
    isCritical: true
  }
];