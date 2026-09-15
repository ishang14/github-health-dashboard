import { describe, it, expect } from "vitest";
import { clamp, inverseScore, getHealthStatus } from "../scoreUtils.js";

describe("clamp", () => {
  it("passes values inside the range through unchanged", () => {
    expect(clamp(42)).toBe(42);
  });

  it("floors values below the minimum", () => {
    expect(clamp(-10)).toBe(0);
  });

  it("ceilings values above the maximum", () => {
    expect(clamp(150)).toBe(100);
  });

  it("respects a custom min/max range", () => {
    expect(clamp(5, 10, 20)).toBe(10);
    expect(clamp(25, 10, 20)).toBe(20);
    expect(clamp(15, 10, 20)).toBe(15);
  });
});

describe("inverseScore", () => {
  it("returns 100 when value is 0 (best case)", () => {
    expect(inverseScore(0, 60)).toBe(100);
  });

  it("returns 0 when value equals maxValue (worst case)", () => {
    expect(inverseScore(60, 60)).toBe(0);
  });

  it("scales linearly between 0 and maxValue", () => {
    expect(inverseScore(30, 60)).toBe(50);
  });

  it("clamps below 0 when value exceeds maxValue", () => {
    expect(inverseScore(120, 60)).toBe(0);
  });

  it("returns 100 when maxValue is 0 or negative, avoiding division by zero", () => {
    expect(inverseScore(10, 0)).toBe(100);
    expect(inverseScore(10, -5)).toBe(100);
  });
});

describe("getHealthStatus", () => {
  it.each([
    [100, "Excellent"],
    [90, "Excellent"],
    [89, "Healthy"],
    [75, "Healthy"],
    [74, "Needs Attention"],
    [60, "Needs Attention"],
    [59, "At Risk"],
    [40, "At Risk"],
    [39, "Poor"],
    [0, "Poor"]
  ])("maps score %i to %s", (score, expected) => {
    expect(getHealthStatus(score)).toBe(expected);
  });
});
