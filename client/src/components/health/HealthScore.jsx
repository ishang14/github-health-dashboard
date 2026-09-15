import { Activity, ShieldCheck } from "lucide-react";

const getScoreStyle = (score) => {
  if (score >= 90) {
    return {
      ring: "border-emerald-500/30",
      text: "text-emerald-400",
      badge:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    };
  }

  if (score >= 75) {
    return {
      ring: "border-sky-500/30",
      text: "text-sky-400",
      badge:
        "bg-sky-500/10 text-sky-400 border-sky-500/20"
    };
  }

  if (score >= 60) {
    return {
      ring: "border-amber-500/30",
      text: "text-amber-400",
      badge:
        "bg-amber-500/10 text-amber-400 border-amber-500/20"
    };
  }

  if (score >= 40) {
    return {
      ring: "border-orange-500/30",
      text: "text-orange-400",
      badge:
        "bg-orange-500/10 text-orange-400 border-orange-500/20"
    };
  }

  return {
    ring: "border-red-500/30",
    text: "text-red-400",
    badge:
      "bg-red-500/10 text-red-400 border-red-500/20"
  };
};

const HealthScore = ({ health }) => {
  const score = health.overallScore;
  const style = getScoreStyle(score);

  return (
    <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-8">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-center">
        
        {/* Score + Explanation */}
        <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center">
          
          {/* Score Circle */}
          <div
            className={`
              flex h-32 w-32 shrink-0
              items-center justify-center
              rounded-full
              border-[9px]
              ${style.ring}
              bg-zinc-950
              sm:h-36 sm:w-36 sm:border-[10px]
            `}
          >
            <div className="text-center">
              <p
                className={`text-4xl font-bold tracking-tight sm:text-5xl ${style.text}`}
              >
                {score}
              </p>

              <p className="text-[10px] uppercase tracking-widest text-zinc-600 sm:text-xs">
                / 100
              </p>
            </div>
          </div>

          {/* Health Description */}
          <div className="min-w-0 w-full text-center sm:text-left">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Repository Health
              </h2>

              <span
                className={`
                  inline-flex
                  shrink-0
                  rounded-full
                  border
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${style.badge}
                `}
              >
                {health.status}
              </span>
            </div>

            <p className="mx-auto max-w-xl text-sm leading-6 text-zinc-400 sm:mx-0">
              GitHealth evaluates repository activity,
              maintenance, issue management, pull requests,
              community contribution, and documentation quality.
            </p>
          </div>
        </div>

        {/* Analysis Engine */}
        <div className="w-full shrink-0 rounded-xl border border-zinc-800 bg-zinc-950 p-4 md:w-auto md:min-w-[190px]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
              <ShieldCheck
                size={18}
                className="text-zinc-300"
              />
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Analysis engine
              </p>

              <p className="text-sm font-semibold text-white">
                Completed
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <Activity size={14} />
            6 health dimensions evaluated
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthScore;
