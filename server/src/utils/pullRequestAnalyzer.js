export const analyzePullRequests = (pullRequests) => {
  const now = new Date();

  const openPRs = pullRequests.filter(
    (pr) => pr.state === "open"
  );

  const closedPRs = pullRequests.filter(
    (pr) => pr.state === "closed"
  );

  const mergedPRs = pullRequests.filter(
    (pr) => pr.merged_at !== null
  );

  const stalePRs = openPRs.filter((pr) => {
    const lastActivity = new Date(pr.updated_at);

    const daysSinceActivity =
      (now - lastActivity) / (1000 * 60 * 60 * 24);

    return daysSinceActivity > 30;
  });

  const mergeRate =
    closedPRs.length > 0
      ? (mergedPRs.length / closedPRs.length) * 100
      : 0;

  const mergedPRsWithDuration = mergedPRs.filter(
    (pr) => pr.created_at && pr.merged_at
  );

  const averageMergeTime =
    mergedPRsWithDuration.length > 0
      ? mergedPRsWithDuration.reduce((total, pr) => {
          const created = new Date(pr.created_at);
          const merged = new Date(pr.merged_at);

          const duration =
            (merged - created) / (1000 * 60 * 60 * 24);

          return total + duration;
        }, 0) / mergedPRsWithDuration.length
      : 0;

  return {
    totalPRsAnalyzed: pullRequests.length,
    openPRs: openPRs.length,
    closedPRs: closedPRs.length,
    mergedPRs: mergedPRs.length,
    stalePRs: stalePRs.length,

    stalePRPercentage:
      openPRs.length > 0
        ? Number(
            ((stalePRs.length / openPRs.length) * 100).toFixed(2)
          )
        : 0,

    mergeRate: Number(mergeRate.toFixed(2)),

    averageMergeTimeDays: Number(
      averageMergeTime.toFixed(1)
    )
  };
};