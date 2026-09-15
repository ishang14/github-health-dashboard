export const analyzeIssues = (issues) => {
  const now = new Date();

  const openIssues = issues.filter(
    (issue) => issue.state === "open"
  );

  const closedIssues = issues.filter(
    (issue) => issue.state === "closed"
  );

  const staleIssues = openIssues.filter((issue) => {
    const lastActivity = new Date(issue.updated_at);

    const daysSinceActivity =
      (now - lastActivity) / (1000 * 60 * 60 * 24);

    return daysSinceActivity > 90;
  });

  const issueClosureRate =
    issues.length > 0
      ? (closedIssues.length / issues.length) * 100
      : 0;

  const averageOpenIssueAge =
    openIssues.length > 0
      ? openIssues.reduce((total, issue) => {
          const created = new Date(issue.created_at);

          const age =
            (now - created) / (1000 * 60 * 60 * 24);

          return total + age;
        }, 0) / openIssues.length
      : 0;

  return {
    totalIssuesAnalyzed: issues.length,
    openIssues: openIssues.length,
    closedIssues: closedIssues.length,
    staleIssues: staleIssues.length,
    staleIssuePercentage:
      openIssues.length > 0
        ? Number(
            ((staleIssues.length / openIssues.length) * 100).toFixed(2)
          )
        : 0,
    issueClosureRate: Number(issueClosureRate.toFixed(2)),
    averageOpenIssueAgeDays: Number(
      averageOpenIssueAge.toFixed(1)
    )
  };
};