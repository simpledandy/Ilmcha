import {
  testPathParsing,
  testPointScaling,
  testProximityCheck,
  runTracingTests,
  testCommonPaths,
  TestPoint,
} from "../tracingTests";

describe("Tracing Tests Utils", () => {
  describe("testPathParsing", () => {
    it("parses valid path data successfully", () => {
      const result = testPathParsing("M 50 80 L 30 20 L 70 20");

      expect(result.success).toBe(true);
      expect(result.message).toContain("Successfully parsed");
      expect(result.data?.points).toHaveLength(3);
    });

    it("handles empty path data", () => {
      const result = testPathParsing("");

      expect(result.success).toBe(false);
      expect(result.message).toContain("No points generated");
    });

    it("handles invalid path data", () => {
      const result = testPathParsing("INVALID_PATH");

      expect(result.success).toBe(false);
      expect(result.message).toContain("No points generated");
    });

    it("handles malformed commands gracefully", () => {
      const result = testPathParsing("M 50 80 L 30 20 M INVALID L 70 20");

      expect(result.success).toBe(true);
      expect(result.data?.points).toHaveLength(3); // Should still parse valid parts
    });

    it("handles complex SVG commands", () => {
      const result = testPathParsing(
        "M 50 80 Q 60 70 70 80 C 80 90 90 70 100 80",
      );

      expect(result.success).toBe(true);
      expect(result.data?.points).toHaveLength(3);
    });

    it("handles very long path data", () => {
      const longPath = "M 50 80 " + "L 30 20 ".repeat(100);
      const result = testPathParsing(longPath);

      expect(result.success).toBe(true);
      expect(result.data?.points).toHaveLength(101);
    });

    it("handles negative coordinates", () => {
      const result = testPathParsing("M -50 -80 L -30 -20 L -70 -20");

      expect(result.success).toBe(true);
      expect(result.data?.points).toHaveLength(3);
    });

    it("handles decimal coordinates", () => {
      const result = testPathParsing("M 50.5 80.3 L 30.1 20.7 L 70.9 20.2");

      expect(result.success).toBe(true);
      expect(result.data?.points).toHaveLength(3);
    });
  });

  describe("testPointScaling", () => {
    const testPoints: TestPoint[] = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 50, y: 50 },
    ];

    it("scales points successfully", () => {
      const result = testPointScaling(testPoints);

      expect(result.success).toBe(true);
      expect(result.message).toContain("Successfully scaled");
      expect(result.data?.scaledPoints).toHaveLength(3);
      expect(result.data?.scale).toBeGreaterThan(0);
    });

    it("handles empty points array", () => {
      const result = testPointScaling([]);

      expect(result.success).toBe(false);
      expect(result.message).toContain("No points to scale");
    });

    it("handles single point", () => {
      const result = testPointScaling([{ x: 50, y: 50 }]);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Path has zero dimensions");
    });

    it("handles zero-dimension path", () => {
      const result = testPointScaling([
        { x: 50, y: 50 },
        { x: 50, y: 50 },
      ]);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Path has zero dimensions");
    });

    it("handles very large coordinates", () => {
      const largePoints: TestPoint[] = [
        { x: 0, y: 0 },
        { x: 10000, y: 10000 },
      ];

      const result = testPointScaling(largePoints);

      expect(result.success).toBe(true);
      expect(result.data?.scale).toBeLessThanOrEqual(5); // Should be limited
    });

    it("handles negative coordinates", () => {
      const negativePoints: TestPoint[] = [
        { x: -100, y: -100 },
        { x: 100, y: 100 },
      ];

      const result = testPointScaling(negativePoints);

      expect(result.success).toBe(true);
      expect(result.data?.scaledPoints).toHaveLength(2);
    });

    it("uses custom canvas size", () => {
      const result = testPointScaling(testPoints, 500);

      expect(result.success).toBe(true);
      expect(result.data?.bounds).toBeDefined();
    });
  });

  describe("testProximityCheck", () => {
    const testPoints: TestPoint[] = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
      { x: 50, y: 50 },
    ];

    it("finds closest point successfully", () => {
      const result = testProximityCheck(testPoints, 45, 45);

      expect(result.success).toBe(true);
      expect(result.message).toContain("Found closest point");
      expect(result.data?.closestIndex).toBe(2); // Should be closest to {x: 50, y: 50}
      expect(result.data?.closestDistance).toBeGreaterThan(0);
    });

    it("handles empty points array", () => {
      const result = testProximityCheck([], 50, 50);

      expect(result.success).toBe(false);
      expect(result.message).toContain("No tracing points available");
    });

    it("handles exact point match", () => {
      const result = testProximityCheck(testPoints, 50, 50);

      expect(result.success).toBe(true);
      expect(result.data?.closestDistance).toBe(0);
      expect(result.data?.closestIndex).toBe(2);
    });

    it("handles very far point", () => {
      const result = testProximityCheck(testPoints, 1000, 1000);

      expect(result.success).toBe(true);
      expect(result.data?.closestIndex).toBe(1); // Should be closest to {x: 100, y: 100}
      expect(result.data?.closestDistance).toBeGreaterThan(0);
    });

    it("handles negative coordinates", () => {
      const result = testProximityCheck(testPoints, -50, -50);

      expect(result.success).toBe(true);
      expect(result.data?.closestIndex).toBe(0); // Should be closest to {x: 0, y: 0}
    });
  });

  describe("runTracingTests", () => {
    it("runs all tests successfully for valid path", () => {
      const results = runTracingTests("M 50 80 L 30 20 L 70 20");

      expect(results).toHaveLength(3);
      expect(results[0].success).toBe(true); // Path parsing
      expect(results[1].success).toBe(true); // Point scaling
      expect(results[2].success).toBe(true); // Proximity check
    });

    it("handles invalid path data", () => {
      const results = runTracingTests("INVALID_PATH");

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
    });

    it("stops at first failure", () => {
      const results = runTracingTests("M 50 50 L 50 50"); // Zero dimension path

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true); // Path parsing succeeds
      expect(results[1].success).toBe(false); // Point scaling fails
    });
  });

  describe("testCommonPaths", () => {
    it("tests all common paths successfully", () => {
      const allResults = testCommonPaths();

      expect(Object.keys(allResults)).toContain("Letter A");
      expect(Object.keys(allResults)).toContain("Letter B");
      expect(Object.keys(allResults)).toContain("Number 1");
      expect(Object.keys(allResults)).toContain("Number 2");

      // Each path should have test results
      Object.values(allResults).forEach((results) => {
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
      });
    });

    it("provides detailed test results", () => {
      const allResults = testCommonPaths();
      const letterAResults = allResults["Letter A"];

      expect(letterAResults).toHaveLength(3);
      expect(letterAResults[0].success).toBe(true); // Path parsing
      expect(letterAResults[1].success).toBe(true); // Point scaling
      expect(letterAResults[2].success).toBe(true); // Proximity check
    });
  });
});
