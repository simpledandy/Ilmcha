import { Segment } from "@/src/types/common";

export const hexagon: Segment[] = [
  // Top right
  {
    points: [
      { x: 0.1, y: 0.5 },
      { x: 0.3, y: 0.1 }
    ],
    isCritical: true
  },
  // Right
  {
    points: [
      { x: 0.3, y: 0.1 },
      { x: 0.7, y: 0.1 }
    ]
  },
  // Bottom right
  {
    points: [
      { x: 0.7, y: 0.1 },
      { x: 0.9, y: 0.5 }
    ],
    isCritical: true
  },
  // Bottom left
  {
    points: [
      { x: 0.9, y: 0.5 },
      { x: 0.7, y: 0.9 }
    ]
  },
  // Left
  {
    points: [
      { x: 0.7, y: 0.9 },
      { x: 0.3, y: 0.9 }
    ],
    isCritical: true
  },
  // Top left
  {
    points: [
      { x: 0.3, y: 0.9 },
      { x: 0.1, y: 0.5 }
    ]
  }
];