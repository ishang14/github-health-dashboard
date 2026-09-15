import {
  GitCommit,
  CalendarDays,
  CircleDot,
  AlertTriangle,
  GitPullRequest,
  Clock3,
  Users,
  BookOpen
} from "lucide-react";

const MetricCards = ({ metrics }) => {
  const cards = [
    {
      label: "Commits",
      value: metrics.activity.commitsLast30Days,
      suffix: "last 30 days",
      icon: GitCommit
    },
    {
      label: "Active Days",
      value: metrics.activity.activeDaysLast30Days,
      suffix: "last 30 days",
      icon: CalendarDays
    },
    {
      label: "Open Issues",
      value: metrics.issueHealth.openIssues,
      suffix: "currently open",
      icon: CircleDot
    },
    {
      label: "Stale Issues",
      value: `${metrics.issueHealth.staleIssuePercentage}%`,
      suffix: "of open issues",
      icon: AlertTriangle
    },
    {
      label: "PR Merge Rate",
      value: `${metrics.pullRequestHealth.mergeRate}%`,
      suffix: "of closed PRs",
      icon: GitPullRequest
    },
    {
      label: "Avg Merge Time",
      value: metrics.pullRequestHealth.averageMergeTimeDays,
      suffix: "days",
      icon: Clock3
    },
    {
      label: "Contributors",
      value: metrics.contributorHealth.totalContributors,
      suffix: "total contributors",
      icon: Users
    },
    {
      label: "Documentation",
      value: `${metrics.documentationHealth.score}`,
      suffix: "documentation score",
      icon: BookOpen
    }
  ];

  return (
    <section className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Repository Metrics
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Key signals extracted from the repository.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                  <Icon size={18} className="text-zinc-300" />
                </div>

                <span className="text-xs text-zinc-600">
                  Metric
                </span>
              </div>

              <div className="mt-5">
                <p className="text-2xl font-bold tracking-tight text-white">
                  {card.value}
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-300">
                  {card.label}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  {card.suffix}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MetricCards;