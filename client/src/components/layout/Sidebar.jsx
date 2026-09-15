import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  History,
  Settings,
  Activity,
  X
} from "lucide-react";

const workspaceNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/repositories", label: "Repositories", icon: GitBranch },
  { to: "/history", label: "History", icon: History }
];

const systemNav = [
  { to: "/settings", label: "Settings", icon: Settings }
];

const linkClass = ({ isActive }) =>
  [
    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
    isActive
      ? "bg-zinc-800 font-medium text-white"
      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
  ].join(" ");

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const closeOnMobile = () => setMobileOpen(false);

  const renderLink = ({ to, label, icon: Icon, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      onClick={closeOnMobile}
      className={linkClass}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeOnMobile}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r border-zinc-800 bg-zinc-950
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-zinc-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950">
              <Activity size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                GitHealth
              </h1>

              <p className="text-xs text-zinc-500">
                Repository intelligence
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={closeOnMobile}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Workspace
          </p>

          {workspaceNav.map(renderLink)}

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            System
          </p>

          {systemNav.map(renderLink)}
        </nav>

        {/* Bottom */}
        <div className="border-t border-zinc-800 p-4">
          <div className="rounded-xl bg-zinc-900 p-4">
            <p className="text-xs font-medium text-zinc-400">
              GitHealth Engine
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs text-zinc-500">
                System operational
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
