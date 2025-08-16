import { Segment } from "@/src/types/common";

// Tracing segments for letter M
export const M:Segment[] = [
  { points: [ { x: 0.3, y: 0.9 }, { x: 0.3, y: 0.1 } ] }, // Left vertical
  { points: [ { x: 0.3, y: 0.1 }, { x: 0.5, y: 0.5 } ] }, // Up to middle
  { points: [ { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.1 } ] }, // Down to top right
  { points: [ { x: 0.7, y: 0.1 }, { x: 0.7, y: 0.9 } ] }, // Right vertical
];