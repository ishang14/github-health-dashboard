export const generateRecommendations = ({
  activity,
  issueHealth,
  pullRequestHealth,
  contributorHealth,
  documentationHealth
}) => {
  const recommendations = [];

  // Activity
  if (activity.commitsLast30Days === 0) {
    recommendations.push({
      type: "critical",
      category: "Activity",
      message:
        "No commits were detected in the last 30 days.",
      suggestion:
        "Investigate whether the repository is actively maintained."
    });
  } else if (activity.activeDaysLast30Days < 5) {
    recommendations.push({
      type: "warning",
      category: "Activity",
      message:
        "Development activity is concentrated on relatively few days.",
      suggestion:
        "Consider maintaining a more consistent development cadence."
    });
  }

  // Issues
  if (issueHealth.staleIssuePercentage > 30) {
    recommendations.push({
      type: "warning",
      category: "Issues",
      message:
        `${issueHealth.staleIssuePercentage}% of open issues are stale.`,
      suggestion:
        "Review inactive issues and close or prioritize them."
    });
  }

  if (issueHealth.averageOpenIssueAgeDays > 90) {
    recommendations.push({
      type: "warning",
      category: "Issues",
      message:
        `Average open issue age is ${issueHealth.averageOpenIssueAgeDays} days.`,
      suggestion:
        "Improve issue triage and resolution workflows."
    });
  }

  // Pull Requests
  if (pullRequestHealth.stalePRPercentage > 25) {
    recommendations.push({
      type: "warning",
      category: "Pull Requests",
      message:
        `${pullRequestHealth.stalePRPercentage}% of open PRs are stale.`,
      suggestion:
        "Review inactive pull requests and improve review turnaround."
    });
  }

  if (pullRequestHealth.averageMergeTimeDays > 14) {
    recommendations.push({
      type: "warning",
      category: "Pull Requests",
      message:
        `Average PR merge time is ${pullRequestHealth.averageMergeTimeDays} days.`,
      suggestion:
        "Consider reducing review bottlenecks and improving PR workflows."
    });
  }

  // Community
  if (contributorHealth.topContributorPercentage > 70) {
    recommendations.push({
      type: "warning",
      category: "Community",
      message:
        `The top contributor accounts for ${contributorHealth.topContributorPercentage}% of contributions.`,
      suggestion:
        "Encourage broader contributor participation to reduce contributor concentration."
    });
  }

  // Documentation
  if (documentationHealth.score < 60) {
    recommendations.push({
      type: "warning",
      category: "Documentation",
      message:
        `Documentation score is ${documentationHealth.score}/100.`,
      suggestion:
        "Add missing project documentation such as README, contribution guidelines, or license information."
    });
  }

  // Positive signal
  if (
    documentationHealth.score >= 80 &&
    activity.activeDaysLast30Days >= 10
  ) {
    recommendations.push({
      type: "positive",
      category: "Overall",
      message:
        "The repository shows strong documentation and consistent development activity.",
      suggestion:
        "Continue maintaining the current development and documentation practices."
    });
  }

  return recommendations;
};