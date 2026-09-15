import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PAGE_META = {
  "/": {
    title: "Dashboard",
    subtitle: "Repository overview"
  },
  "/repositories": {
    title: "Repositories",
    subtitle: "Everything you've analyzed"
  },
  "/history": {
    title: "History",
    subtitle: "Score changes over time"
  },
  "/settings": {
    title: "Settings",
    subtitle: "Preferences and data"
  }
};

const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const meta = PAGE_META[pathname] || PAGE_META["/"];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div className="lg:ml-64">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
