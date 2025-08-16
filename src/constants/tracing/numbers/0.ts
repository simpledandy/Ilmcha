import { Segment } from "@/src/types/common";

// Normalized coordinates (0–1) for scaling
export const zero: Segment[] = [
  {
    points: [
      // Top curve
      { x: 0.65, y: 0.2 }, { x: 0.55, y: 0.1 },
      { x: 0.45, y: 0.1 }, { x: 0.35, y: 0.2 },
      // Left side
      { x: 0.3, y: 0.3 }, { x: 0.3, y: 0.7 },
      // Bottom curve
      { x: 0.35, y: 0.8 }, { x: 0.45, y: 0.9 },
      { x: 0.55, y: 0.9 }, { x: 0.65, y: 0.8 },
      // Right side
      { x: 0.7, y: 0.7 }, { x: 0.7, y: 0.3 },
      // Close to top
      { x: 0.65, y: 0.2 }
    ],
    isCritical: true
  }
];