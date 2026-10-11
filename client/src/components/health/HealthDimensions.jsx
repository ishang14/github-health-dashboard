import {
  Activity,
  Wrench,
  CircleDot,
  GitPullRequest,
  Users,
  BookOpen
} from "lucide-react";

import { scoreTextColor, scoreBarColor } from "../../utils/score";

const dimensions = [
  {
    key: "activity",
    label: "Activity",
    description: "Development momentum",
    icon: Activity
  },
  {
    key: "maintenance",
    label: "Maintenance",
    description: "Overall maintainability",
    icon: Wrench
  },
  {
    key: "issues",
    label: "Issue Health",
    description: "Issue management",
    icon: CircleDot
  },
  {
    key: "pullRequests",
    label: "PR Health",
    description: "Pull request workflow",
    icon: GitPullRequest
  },
  {
    key: "community",
    label: "Community",
    description: "Contributor distribution",
    icon: Users
  },
  {
    key: "documentation",
    label: "Documentation",
    description: "Project documentation",
    icon: BookOpen
  }
];

const HealthDimensions = ({ categories }) => {
  return (
    <section className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Health Dimensions
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          How each area contributes to the repository's overall health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dimensions.map((dimension) => {
          const Icon = dimension.icon;
          const score = Math.round(categories[dimension.key] ?? 0);

          return (
            <div
              key={dimension.key}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
                    <Icon
                      size={19}
                      className="text-zinc-300"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {dimension.label}
                    </h3>

                    <p className="mt-0.5 text-xs text-zinc-600">
                      {dimension.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xl font-bold ${scoreTextColor(score)}`}
                >
                  {score}
                </span>
              </div>

              <div className="mt-5">
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[11px] text-zinc-600">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HealthDimensions;