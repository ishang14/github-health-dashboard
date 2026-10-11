import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the account menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

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
        <div
          ref={menuRef}
          className="relative border-l border-zinc-800 pl-2 sm:pl-4"
        >
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            title="Account"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700"
          >
            {user?.name ? (
              user.name.trim().charAt(0).toUpperCase()
            ) : (
              <User size={17} className="text-zinc-400" />
            )}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl"
            >
              <div className="border-b border-zinc-800 px-4 py-3">
                <p className="truncate text-sm font-medium text-white">
                  {user?.name || "Account"}
                </p>

                <p className="truncate text-xs text-zinc-500">
                  {user?.email || "Signed in"}
                </p>
              </div>

              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                  navigate("/login", { replace: true });
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
