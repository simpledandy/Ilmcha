import { Segment } from "@/src/types/common";


export const B: Segment[] = [
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
  // Lower bowl
  {
    points: [
      { x: 0.3, y: 0.5 },
      { x: 0.6, y: 0.5 },
      { x: 0.75, y: 0.6 },
      { x: 0.75, y: 0.8 },
      { x: 0.6, y: 0.9 },
      { x: 0.3, y: 0.9 }
    ]
  }
];