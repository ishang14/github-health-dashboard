import { useState } from "react";
import {
  Search,
  ArrowRight
} from "lucide-react";

// Parent passes a changing `key` when `initialValue` changes, so this
// component remounts and picks up the new value without a sync effect.
const RepositorySearch = ({
  onAnalyze,
  loading,
  initialValue = ""
}) => {
  const [repoUrl, setRepoUrl] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!repoUrl.trim()) return;

    onAnalyze(repoUrl.trim());
  };

  return (
    <section className="mb-6 sm:mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-8">

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">

          <div className="mb-6 max-w-2xl">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-indigo-400 sm:text-sm">
              Repository intelligence
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Understand the health of any GitHub repository.
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Analyze activity, maintenance, issues,
              pull requests, contributors, and
              documentation in seconds.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex max-w-3xl flex-col gap-3 sm:flex-row"
          >
            <div className="flex min-w-0 flex-1 items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 transition focus-within:border-indigo-500">

              <Search
                size={19}
                className="mr-3 shrink-0 text-zinc-500"
              />

              <input
                type="text"
                value={repoUrl}
                onChange={(event) =>
                  setRepoUrl(event.target.value)
                }
                placeholder="owner/repo  or  https://github.com/owner/repo"
                className="min-w-0 w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading
                ? "Analyzing..."
                : "Analyze Repository"}

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            Powered by GitHub repository data
          </div>

        </div>
      </div>
    </section>
  );
};

export default RepositorySearch;