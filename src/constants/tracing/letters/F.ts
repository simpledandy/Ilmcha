import { Segment } from "@/src/types/common";

export const F: Segment[] = [
  // Vertical line
  {
    points: [
      { x: 0.3, y: 0.1 },
      { x: 0.3, y: 0.9 }
    ],
    isCritical: true
  },
  // Top bar
  {
    points: [
      { x: 0.3, y: 0.1 },
      { x: 0.7, y: 0.1 }
    ]
  },
  // Middle bar
  {
    points: [
      { x: 0.3, y: 0.5 },
      { x: 0.6, y: 0.5 }
    ],
    isCritical: true
  }
];