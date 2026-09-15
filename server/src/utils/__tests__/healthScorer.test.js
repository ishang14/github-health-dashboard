import { describe, it, expect } from "vitest";
import { calculateHealthScore } from "../healthScorer.js";

const baseInput = {
  activity: {
    commitsLast30Days: 20,
    activeDaysLast30Days: 15
  },
  issueHealth: {
    staleIssuePercentage: 10,
    issueClosureRate: 80,
    averageOpenIssueAgeDays: 30
  },
  pullRequestHealth: {
    stalePRPercentage: 10,
    mergeRate: 85,
    averageMergeTimeDays: 5
  },
  contributorHealth: {
    totalContributors: 12,
    topContributorPercentage: 30
  },
  documentationHealth: {
    score: 90
  }
};

describe("calculateHealthScore", () => {
  it("returns a score, status, and per-category breakdown", () => {
    const result = calculateHealthScore(baseInput);

    expect(result).toHaveProperty("overallScore");
    expect(result).toHaveProperty("status");
    expect(result.categories).toMatchObject({
      activity: expect.any(Number),
      maintenance: expect.any(Number),
      issues: expect.any(Number),
      pullRequests: expect.any(Number),
      community: expect.any(Number),
      documentation: expect.any(Number)
    });
  });

  it("keeps every category and the overall score within 0-100", () => {
    const { overallScore, categories } = calculateHealthScore(baseInput);

    expect(overallScore).toBeGreaterThanOrEqual(0);
    expect(overallScore).toBeLessThanOrEqual(100);

    Object.values(categories).forEach((score) => {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  it("scores a dead repository (no commits, no issue/PR turnover) as poor", () => {
    const deadInput = {
      activity: { commitsLast30Days: 0, activeDaysLast30Days: 0 },
      issueHealth: {
        staleIssuePercentage: 90,
        issueClosureRate: 5,
        averageOpenIssueAgeDays: 365
      },
      pullRequestHealth: {
        stalePRPercentage: 90,
        mergeRate: 5,
        averageMergeTimeDays: 120
      },
      contributorHealth: { totalContributors: 1, topContributorPercentage: 100 },
      documentationHealth: { score: 0 }
    };

    const { overallScore, categories } = calculateHealthScore(deadInput);

    expect(overallScore).toBeLessThan(40);
    expect(categories.activity).toBe(0);
  });

  it("scores an actively maintained repository as healthy or better", () => {
    const thrivingInput = {
      activity: { commitsLast30Days: 40, activeDaysLast30Days: 25 },
      issueHealth: {
        staleIssuePercentage: 2,
        issueClosureRate: 95,
        averageOpenIssueAgeDays: 5
      },
      pullRequestHealth: {
        stalePRPercentage: 2,
        mergeRate: 95,
        averageMergeTimeDays: 1
      },
      contributorHealth: { totalContributors: 25, topContributorPercentage: 15 },
      documentationHealth: { score: 100 }
    };

    const { overallScore, status } = calculateHealthScore(thrivingInput);

    expect(overallScore).toBeGreaterThanOrEqual(75);
    expect(["Healthy", "Excellent"]).toContain(status);
  });

  it("weighs activity more than any single other dimension in the overall score", () => {
    const withGoodActivity = calculateHealthScore(baseInput);
    const withNoActivity = calculateHealthScore({
      ...baseInput,
      activity: { commitsLast30Days: 0, activeDaysLast30Days: 0 }
    });

    expect(withNoActivity.overallScore).toBeLessThan(withGoodActivity.overallScore);
  });
});
