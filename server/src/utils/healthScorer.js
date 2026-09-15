import {
  clamp,
  inverseScore,
  getHealthStatus
} from "./scoreUtils.js";

export const calculateHealthScore = ({
  activity,
  issueHealth,
  pullRequestHealth,
  contributorHealth,
  documentationHealth
}) => {
  // -------------------------
  // 1. Activity Score
  // -------------------------

  const commitScore = clamp(
    activity.commitsLast30Days * 3
  );

  const activeDayScore = clamp(
    activity.activeDaysLast30Days * 5
  );

  const activityScore = Math.round(
    commitScore * 0.6 +
    activeDayScore * 0.4
  );

  // -------------------------
  // 2. Issue Score
  // -------------------------

  const staleIssueScore = clamp(
    100 - issueHealth.staleIssuePercentage
  );

  const issueClosureScore = clamp(
    issueHealth.issueClosureRate
  );

  const issueAgeScore = inverseScore(
    issueHealth.averageOpenIssueAgeDays,
    180
  );

  const issueScore = Math.round(
    staleIssueScore * 0.4 +
    issueClosureScore * 0.3 +
    issueAgeScore * 0.3
  );

  // -------------------------
  // 3. PR Score
  // -------------------------

  const stalePRScore = clamp(
    100 - pullRequestHealth.stalePRPercentage
  );

  const mergeRateScore = clamp(
    pullRequestHealth.mergeRate
  );

  const mergeTimeScore = inverseScore(
    pullRequestHealth.averageMergeTimeDays,
    60
  );

  const pullRequestScore = Math.round(
    stalePRScore * 0.4 +
    mergeRateScore * 0.3 +
    mergeTimeScore * 0.3
  );

  // -------------------------
  // 4. Community Score
  // -------------------------

  const contributorCountScore = clamp(
    contributorHealth.totalContributors * 5
  );

  const contributorConcentrationScore = clamp(
    100 - contributorHealth.topContributorPercentage
  );

  const communityScore = Math.round(
    contributorCountScore * 0.5 +
    contributorConcentrationScore * 0.5
  );

  // -------------------------
  // 5. Documentation Score
  // -------------------------

  const documentationScore =
    documentationHealth.score;

  // -------------------------
  // 6. Maintenance Score
  // -------------------------

  const maintenanceScore = Math.round(
    activityScore * 0.5 +
    issueScore * 0.25 +
    pullRequestScore * 0.25
  );

  // -------------------------
  // Overall Score
  // -------------------------

  const overallScore = Math.round(
    activityScore * 0.25 +
    maintenanceScore * 0.20 +
    issueScore * 0.15 +
    pullRequestScore * 0.15 +
    communityScore * 0.15 +
    documentationScore * 0.10
  );

  return {
    overallScore,

    status: getHealthStatus(overallScore),

    categories: {
      activity: activityScore,
      maintenance: maintenanceScore,
      issues: issueScore,
      pullRequests: pullRequestScore,
      community: communityScore,
      documentation: documentationScore
    }
  };
};