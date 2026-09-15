import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitBranch,
  RefreshCw,
  Trash2,
  LineChart,
  Search
} from "lucide-react";

import {
  getAnalyzedRepositories,
  deleteRepositoryHistory
} from "../services/api";
import {
  scoreBadgeClass,
  formatDate
} from "../utils/score";

const Repositories = () => {
  const navigate = useNavigate();

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [busyKey, setBusyKey] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const load = () => {
    setLoading(true);
    setError("");
    setReloadToken((token) => token + 1);
  };

  useEffect(() => {
    let active = true;

    getAnalyzedRepositories()
      .then((data) => {
        if (active) setRepos(data.repositories || []);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load repositories."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const handleDelete = async (repo) => {
    const key = `${repo.owner}/${repo.repo}`;

    if (!window.confirm(`Delete all stored analyses for ${key}?`)) {
      return;
    }

    try {
      setBusyKey(key);
      await deleteRepositoryHistory(repo.owner, repo.repo);
      setRepos((current) =>
        current.filter(
          (item) => `${item.owner}/${item.repo}` !== key
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete repository."
      );
    } finally {
      setBusyKey("");
    }
  };

  const visible = repos.filter((repo) =>
    `${repo.owner}/${repo.repo}`
      .toLowerCase()
      .includes(filter.trim().toLowerCase())
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            Analyzed Repositories
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {repos.length} repositor{repos.length === 1 ? "y" : "ies"} tracked.
            Select one to re-analyze.
          </p>
        </div>

        <button
          onClick={load}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {repos.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 sm:max-w-sm">
          <Search size={16} className="text-zinc-500" />
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Filter by name..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-center text-sm text-zinc-500">
          Loading repositories…
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-10 text-center">
          <GitBranch size={26} className="mx-auto text-zinc-600" />
          <p className="mt-3 text-sm font-medium text-zinc-300">
            {repos.length === 0
              ? "No repositories analyzed yet"
              : "No matches for that filter"}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            {repos.length === 0
              ? "Run an analysis from the Dashboard to see it here."
              : "Try a different search term."}
          </p>
          {repos.length === 0 && (
            <button
              onClick={() => navigate("/")}
              className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((repo) => {
            const key = `${repo.owner}/${repo.repo}`;

            return (
              <div
                key={key}
                className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700"
              >
                <button
                  onClick={() =>
                    navigate(`/?owner=${repo.owner}&repo=${repo.repo}`)
                  }
                  className="group text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white group-hover:underline">
                        {repo.repositoryName || key}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-600">
                        {repo.snapshotCount} snapshot
                        {repo.snapshotCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-sm font-bold ${scoreBadgeClass(
                        repo.overallScore
                      )}`}
                    >
                      {repo.overallScore}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-zinc-500">
                    {repo.status} · last analyzed{" "}
                    {formatDate(repo.lastAnalyzedAt)}
                  </p>
                </button>

                <div className="mt-4 flex gap-2 border-t border-zinc-800 pt-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/history?owner=${repo.owner}&repo=${repo.repo}`
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700"
                  >
                    <LineChart size={13} />
                    History
                  </button>

                  <button
                    onClick={() => handleDelete(repo)}
                    disabled={busyKey === key}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-950/60 disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    {busyKey === key ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Repositories;
