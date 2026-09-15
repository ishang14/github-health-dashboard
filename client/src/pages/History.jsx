import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Clock, ArrowUpRight } from "lucide-react";

import {
  getAnalyzedRepositories,
  getRepositoryHistory,
  getRecentActivity
} from "../services/api";
import {
  scoreTextColor,
  scoreBadgeClass,
  formatDate,
  formatDay
} from "../utils/score";

const History = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const selectedKey = owner && repo ? `${owner}/${repo}` : "";

  const [repos, setRepos] = useState([]);
  const [activity, setActivity] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(Boolean(selectedKey));
  const [error, setError] = useState("");

  const selectRepo = (nextOwner, nextRepo) => {
    setError("");
    if (!nextOwner || !nextRepo) {
      setSearchParams({});
      return;
    }
    if (`${nextOwner}/${nextRepo}` === selectedKey) return;
    setHistory([]);
    setLoadingRepo(true);
    setSearchParams({ owner: nextOwner, repo: nextRepo });
  };

  // Repo list + global feed once.
  useEffect(() => {
    let active = true;

    Promise.all([getAnalyzedRepositories(), getRecentActivity(40)])
      .then(([repoData, activityData]) => {
        if (!active) return;
        setRepos(repoData.repositories || []);
        setActivity(activityData.activity || []);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load history."
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Per-repo timeline when one is selected.
  useEffect(() => {
    if (!owner || !repo) return undefined;

    let active = true;

    getRepositoryHistory(owner, repo)
      .then((data) => {
        if (active) setHistory(data.history || []);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load repository history."
          );
        }
      })
      .finally(() => {
        if (active) setLoadingRepo(false);
      });

    return () => {
      active = false;
    };
  }, [owner, repo]);

  const chartData = useMemo(
    () =>
      history.map((snapshot) => ({
        date: formatDay(snapshot.createdAt),
        score: snapshot.overallScore
      })),
    [history]
  );

  const delta = useMemo(() => {
    if (history.length < 2) return null;
    return history[history.length - 1].overallScore - history[0].overallScore;
  }, [history]);

  const onSelect = (event) => {
    const [o, r] = event.target.value.split("/");
    selectRepo(o, r);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Health History</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track how a repository's score has moved across analyses.
          </p>
        </div>

        <select
          value={selectedKey}
          onChange={onSelect}
          className="self-start rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
        >
          <option value="">Select a repository…</option>
          {repos.map((item) => (
            <option
              key={`${item.owner}/${item.repo}`}
              value={`${item.owner}/${item.repo}`}
            >
              {item.repositoryName || `${item.owner}/${item.repo}`}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {selectedKey ? (
        <>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {selectedKey}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {history.length} analysis point
                  {history.length === 1 ? "" : "s"}
                  {delta !== null && (
                    <>
                      {" · "}
                      <span
                        className={
                          delta > 0
                            ? "text-emerald-400"
                            : delta < 0
                            ? "text-red-400"
                            : "text-zinc-400"
                        }
                      >
                        {delta > 0 ? "+" : ""}
                        {delta} since first analysis
                      </span>
                    </>
                  )}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/?owner=${owner}&repo=${repo}`)
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Re-analyze
                <ArrowUpRight size={15} />
              </button>
            </div>

            {loadingRepo ? (
              <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
                Loading timeline…
              </div>
            ) : chartData.length < 2 ? (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950 text-center">
                <div>
                  <p className="text-sm font-medium text-zinc-400">
                    Not enough history yet
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Analyze this repository again later to build a trend.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis
                      dataKey="date"
                      stroke="#71717a"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#71717a"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #3f3f46",
                        borderRadius: "12px",
                        color: "#fff"
                      }}
                      labelStyle={{ color: "#a1a1aa" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      strokeWidth={3}
                      stroke="#ffffff"
                      dot={{ r: 4, fill: "#ffffff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">When</th>
                    <th className="px-5 py-3 font-medium">Score</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map((snapshot) => (
                    <tr
                      key={snapshot._id || snapshot.createdAt}
                      className="border-b border-zinc-800/60 last:border-0"
                    >
                      <td className="px-5 py-3 text-zinc-400">
                        {formatDate(snapshot.createdAt)}
                      </td>
                      <td
                        className={`px-5 py-3 font-semibold ${scoreTextColor(
                          snapshot.overallScore
                        )}`}
                      >
                        {snapshot.overallScore}
                      </td>
                      <td className="px-5 py-3 text-zinc-300">
                        {snapshot.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
            <Clock size={16} className="text-zinc-400" />
            Recent Activity
          </div>

          {activity.length === 0 ? (
            <p className="py-6 text-center text-sm text-zinc-500">
              No analyses recorded yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {activity.map((item) => (
                <li key={item._id || `${item.owner}-${item.createdAt}`}>
                  <button
                    onClick={() => selectRepo(item.owner, item.repo)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-left transition hover:border-zinc-700"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {item.repositoryName || `${item.owner}/${item.repo}`}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-bold ${scoreBadgeClass(
                        item.overallScore
                      )}`}
                    >
                      {item.overallScore}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default History;
