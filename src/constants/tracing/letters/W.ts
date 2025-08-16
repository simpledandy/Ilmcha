import { Segment } from "@/src/types/common";

export const W:Segment[] = [
  { points: [ { x: 0.3, y: 0.1 }, { x: 0.4, y: 0.9 } ] }, // Left up
  { points: [ { x: 0.4, y: 0.9 }, { x: 0.5, y: 0.5 } ] }, // Down to middle
  { points: [ { x: 0.5, y: 0.5 }, { x: 0.6, y: 0.9 } ] }, // Up to right
  { points: [ { x: 0.6, y: 0.9 }, { x: 0.7, y: 0.1 } ] }, // Down to end
];