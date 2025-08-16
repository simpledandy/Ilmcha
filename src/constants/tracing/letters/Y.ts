import { Segment } from "@/src/types/common";

// Tracing segments for letter Y
export const Y:Segment[] = [
  { points: [ { x: 0.3, y: 0.1 }, { x: 0.5, y: 0.5 } ] }, // Left diagonal
  { points: [ { x: 0.7, y: 0.1 }, { x: 0.5, y: 0.5 } ] }, // Right diagonal
  { points: [ { x: 0.5, y: 0.5 }, { x: 0.5, y: 0.9 } ] }, // Down
];