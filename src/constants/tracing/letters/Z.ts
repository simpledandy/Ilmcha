import { Segment } from "@/src/types/common";

// Tracing segments for letter Z
export const Z:Segment[] = [
  { points: [ { x: 0.3, y: 0.1 }, { x: 0.7, y: 0.1 } ] }, // Top
  { points: [ { x: 0.7, y: 0.1 }, { x: 0.3, y: 0.9 } ] }, // Diagonal
  { points: [ { x: 0.3, y: 0.9 }, { x: 0.7, y: 0.9 } ] }, // Bottom
];
 