import { Segment } from "@/src/types/common";

// Tracing segments for letter K
export const K:Segment[] = [
  { points: [ { x: 0.3, y: 0.1 }, { x: 0.3, y: 0.9 } ] }, // Main vertical
  { points: [ { x: 0.3, y: 0.5 }, { x: 0.7, y: 0.1 } ] }, // Upper diagonal
  { points: [ { x: 0.3, y: 0.5 }, { x: 0.7, y: 0.9 } ] }, // Lower diagonal
];