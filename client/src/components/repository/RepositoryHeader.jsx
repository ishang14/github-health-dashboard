import {
  GitBranch,
  Star,
  GitFork,
  CircleDot,
  ExternalLink
} from "lucide-react";

const RepositoryHeader = ({ repository }) => {
  return (
    <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
            <GitBranch size={24} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {repository.fullName}
              </h2>

              {repository.language && (
                <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                  {repository.language}
                </span>
              )}
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              {repository.description || "No repository description provided."}
            </p>
          </div>
        </div>

        <a
          href={repository.url}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          View on GitHub
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 border-t border-zinc-800 pt-5">

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Star size={17} />
          <span className="font-semibold text-white">
            {repository.stars.toLocaleString()}
          </span>
          stars
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <GitFork size={17} />
          <span className="font-semibold text-white">
            {repository.forks.toLocaleString()}
          </span>
          forks
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <CircleDot size={17} />
          <span className="font-semibold text-white">
            {repository.openIssues.toLocaleString()}
          </span>
          open issues
        </div>

      </div>
    </section>
  );
};

export default RepositoryHeader;