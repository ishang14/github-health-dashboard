import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb
} from "lucide-react";

const getRecommendationStyle = (type) => {
  switch (type?.toLowerCase()) {
    case "critical":
      return {
        icon: AlertTriangle,
        iconClass: "text-red-400",
        iconBackground: "bg-red-500/10",
        border: "border-red-500/20"
      };

    case "warning":
      return {
        icon: AlertTriangle,
        iconClass: "text-amber-400",
        iconBackground: "bg-amber-500/10",
        border: "border-amber-500/20"
      };

    case "positive":
      return {
        icon: CheckCircle2,
        iconClass: "text-emerald-400",
        iconBackground: "bg-emerald-500/10",
        border: "border-emerald-500/20"
      };

    default:
      return {
        icon: Info,
        iconClass: "text-sky-400",
        iconBackground: "bg-sky-500/10",
        border: "border-sky-500/20"
      };
  }
};

const Recommendations = ({ recommendations }) => {
  return (
    <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
          <Lightbulb size={19} className="text-zinc-300" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Engineering Insights
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Actionable recommendations generated from repository signals.
          </p>
        </div>
      </div>

      {!recommendations || recommendations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950 p-6 text-center">
          <CheckCircle2
            size={24}
            className="mx-auto text-emerald-400"
          />

          <p className="mt-3 text-sm font-medium text-zinc-300">
            No major issues detected.
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            The repository is currently showing healthy engineering signals.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => {
            const style = getRecommendationStyle(
              recommendation.type
            );

            const Icon = style.icon;

            return (
              <div
                key={`${recommendation.type}-${index}`}
                className={`flex gap-4 rounded-xl border ${style.border} bg-zinc-950 p-4`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBackground}`}
                >
                  <Icon
                    size={18}
                    className={style.iconClass}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${style.iconClass}`}
                    >
                      {recommendation.type}
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-zinc-300">
                    {recommendation.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Recommendations;