import { Segment } from "@/src/types/common";

export const R: Segment[] = [
  // Spine
  {
    points: [
      { x: 0.3, y: 0.1 },
      { x: 0.3, y: 0.9 }
    ],
    isCritical: true
  },
  // Upper bowl
  {
    points: [
      { x: 0.3, y: 0.1 },
      { x: 0.6, y: 0.1 },
      { x: 0.7, y: 0.2 },
      { x: 0.7, y: 0.4 },
      { x: 0.6, y: 0.5 },
      { x: 0.3, y: 0.5 }
    ]
  },
  { points: [ { x: 0.3, y: 0.5 }, { x: 0.8, y: 0.9 } ] }, // Diagonal leg
];