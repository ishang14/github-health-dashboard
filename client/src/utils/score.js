export const scoreTextColor = (score) => {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-sky-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
};

export const scoreBarColor = (score) => {
  if (score >= 90) return "bg-emerald-400";
  if (score >= 75) return "bg-sky-400";
  if (score >= 60) return "bg-amber-400";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-400";
};

export const scoreBadgeClass = (score) => {
  if (score >= 90) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (score >= 75) return "bg-sky-500/10 text-sky-400 border-sky-500/20";
  if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (score >= 40) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  return "bg-red-500/10 text-red-400 border-red-500/20";
};

export const formatDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

export const formatDay = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
