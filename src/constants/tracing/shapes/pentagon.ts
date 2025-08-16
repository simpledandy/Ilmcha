import { Segment } from "@/src/types/common";

export const pentagon: Segment[] = [
  // Top to right
  {
    points: [
      { x: 0.5, y: 0.1 },
      { x: 0.8, y: 0.4 }
    ],
    isCritical: true
  },
  // Right to bottom right
  {
    points: [
      { x: 0.8, y: 0.4 },
      { x: 0.7, y: 0.8 }
    ]
  },
  // Bottom right to left
  {
    points: [
      { x: 0.7, y: 0.8 },
      { x: 0.3, y: 0.8 }
    ],
    isCritical: true
  },
  // Bottom left to top left
  {
    points: [
      { x: 0.3, y: 0.8 },
      { x: 0.2, y: 0.4 }
    ]
  },
  // Close
  {
    points: [
      { x: 0.2, y: 0.4 },
      { x: 0.5, y: 0.1 }
    ]
  }
];