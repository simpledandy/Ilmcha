import { Segment } from "@/src/types/common";

export const star: Segment[] = [
  // Top to right middle
  {
    points: [
      { x: 0.5, y: 0.1 },
      { x: 0.7, y: 0.7 }
    ],
    isCritical: true
  },
  // To bottom left
  {
    points: [
      { x: 0.7, y: 0.7 },
      { x: 0.1, y: 0.4 }
    ]
  },
  // To top right
  {
    points: [
      { x: 0.1, y: 0.4 },
      { x: 0.9, y: 0.4 }
    ],
    isCritical: true
  },
  // To bottom middle
  {
    points: [
      { x: 0.9, y: 0.4 },
      { x: 0.3, y: 0.7 }
    ]
  },
  // Back to top
  {
    points: [
      { x: 0.3, y: 0.7 },
      { x: 0.5, y: 0.1 }
    ],
    isCritical: true
  }
];