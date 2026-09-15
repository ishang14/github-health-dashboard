export const analyzeContributors = (contributors) => {
  const validContributors = contributors.filter(
    (contributor) => !contributor.type || contributor.type === "User"
  );

  const totalContributions = validContributors.reduce(
    (total, contributor) => total + contributor.contributions,
    0
  );

  const sortedContributors = [...validContributors].sort(
    (a, b) => b.contributions - a.contributions
  );

  const topContributor = sortedContributors[0];

  const topThreeContributions = sortedContributors
    .slice(0, 3)
    .reduce(
      (total, contributor) => total + contributor.contributions,
      0
    );

  const topContributorPercentage =
    totalContributions > 0
      ? (topContributor.contributions / totalContributions) * 100
      : 0;

  const topThreePercentage =
    totalContributions > 0
      ? (topThreeContributions / totalContributions) * 100
      : 0;

  return {
    totalContributors: validContributors.length,

    totalContributions,

    topContributor: topContributor
      ? {
          username: topContributor.login,
          contributions: topContributor.contributions
        }
      : null,

    topContributorPercentage: Number(
      topContributorPercentage.toFixed(2)
    ),

    topThreePercentage: Number(
      topThreePercentage.toFixed(2)
    )
  };
};