export const analyzeActivity = (commits) => {
  const now = new Date();

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const commitsLast7Days = commits.filter((commit) => {
    const date = new Date(commit.commit.author.date);
    return date >= sevenDaysAgo;
  });

  const commitsLast30Days = commits.filter((commit) => {
    const date = new Date(commit.commit.author.date);
    return date >= thirtyDaysAgo;
  });

  const activeDays = new Set(
    commitsLast30Days.map((commit) => {
      const date = new Date(commit.commit.author.date);
      return date.toISOString().split("T")[0];
    })
  );

  const commitsPerWeek =
  commitsLast30Days.length / (30 / 7);

  const latestCommit =
    commits.length > 0
      ? commits[0].commit.author.date
      : null;

  return {
    totalCommitsAnalyzed: commits.length,
    commitsLast7Days: commitsLast7Days.length,
    commitsLast30Days: commitsLast30Days.length,
    commitsPerWeek: Number(commitsPerWeek.toFixed(2)),
    activeDaysLast30Days: activeDays.size,
    latestCommit
  };
};