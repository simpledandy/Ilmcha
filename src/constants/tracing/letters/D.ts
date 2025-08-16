import { Segment } from "@/src/types/common";

export const D: Segment[] = [
  // Spine
  {
    points: [
      { x: 0.3, y: 0.1 },
      { x: 0.3, y: 0.9 }
    ],
    isCritical: true
  },
  // Bowl
  {
    points: [
      { x: 0.3, y: 0.1 },
      { x: 0.6, y: 0.1 },
      { x: 0.75, y: 0.25 },
      { x: 0.75, y: 0.75 },
      { x: 0.6, y: 0.9 },
      { x: 0.3, y: 0.9 }
    ]
  }
];