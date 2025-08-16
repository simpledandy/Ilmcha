import { Segment } from "@/src/types/common";

export const nine: Segment[] = [
  {
    points: [
      // Top circle
      { x: 0.7, y: 0.3 },
      { x: 0.65, y: 0.2 }, { x: 0.6, y: 0.15 },
      { x: 0.55, y: 0.1 },
      { x: 0.45, y: 0.1 }, { x: 0.35, y: 0.2 },
      
      { x: 0.3, y: 0.3 }, { x: 0.35, y: 0.45 },
      { x: 0.5, y: 0.5 }, { x: 0.6, y: 0.5 },
      { x: 0.65, y: 0.45 }, { x: 0.7, y: 0.3 },
    ],
    isCritical: true
  },
  {
    points: [
      // Left side
      { x: 0.7, y: 0.3 }, { x: 0.7, y: 0.6 },
      // Bottom curve
      { x: 0.65, y: 0.8 }, { x: 0.6, y: 0.9 },
      { x: 0.4, y: 0.9 }, { x: 0.35, y: 0.8 },
      // Top curve
      //{ x: 0.3, y: 0.2 }, { x: 0.4, y: 0.1 },
      //{ x: 0.5, y: 0.1 }, { x: 0.6, y: 0.2 },
      // Right side down to middle
      //{ x: 0.65, y: 0.3 }, { x: 0.65, y: 0.5 },
      // Inner curve
      //{ x: 0.6, y: 0.6 }, { x: 0.5, y: 0.6 },
      //{ x: 0.4, y: 0.5 }, { x: 0.4, y: 0.4 },
      //{ x: 0.5, y: 0.3 }, { x: 0.6, y: 0.3 },
      //{ x: 0.65, y: 0.4 }
    ],
    isCritical: true
  }
];