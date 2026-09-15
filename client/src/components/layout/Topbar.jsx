import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Menu,
  LogOut
} from "lucide-react";

import { parseRepoInput } from "../../utils/parseRepoInput";
import { useAuth } from "../../hooks/useAuth";

const Topbar = ({ title = "Dashboard", subtitle = "Repository overview", onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsed = parseRepoInput(query);

    if (!parsed) return;

    setQuery("");
    navigate(`/?owner=${parsed.owner}&repo=${parsed.repo}`);
  };

  return (
    <header className="flex min-h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6 lg:px-8">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="hidden text-sm text-zinc-500 sm:block">
            {subtitle}
          </p>

          <h2 className="text-lg font-semibold text-white sm:text-xl">
            {title}
          </h2>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Search -> jump to analysis */}
        <form
          onSubmit={handleSubmit}
          className="hidden items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 transition focus-within:border-indigo-500 md:flex"
        >
          <Search
            size={17}
            className="text-zinc-500"
          />

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="owner/repo or URL..."
            className="w-44 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600 lg:w-52"
          />
        </form>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-zinc-800 pl-2 sm:pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-200">
            {user?.name ? (
              user.name.trim().charAt(0).toUpperCase()
            ) : (
              <User size={17} className="text-zinc-400" />
            )}
          </div>

          <div className="hidden max-w-[160px] sm:block">
            <p className="truncate text-sm font-medium text-white">
              {user?.name || "Account"}
            </p>

            <p className="truncate text-xs text-zinc-500">
              {user?.email || "Signed in"}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            title="Sign out"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition hover:text-white"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
