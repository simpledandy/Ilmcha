import { Segment } from "@/src/types/common";

// Tracing segments for letter H
export const H: Segment[] = [
  { points: [ { x: 0.3, y: 0.1 }, { x: 0.3, y: 0.9 } ] }, // Left vertical
  { points: [ { x: 0.7, y: 0.1 }, { x: 0.7, y: 0.9 } ] }, // Right vertical
  { points: [ { x: 0.3, y: 0.5 }, { x: 0.7, y: 0.5 } ] }, // Middle
];
