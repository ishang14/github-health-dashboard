import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Repositories from "./pages/Repositories";
import History from "./pages/History";
import Settings from "./pages/Settings";

const FullScreenLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-sm text-zinc-500">
    <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
    Loading…
  </div>
);

const RequireAuth = ({ children }) => {
  const { user, initializing } = useAuth();

  if (initializing) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const RedirectIfAuthed = ({ children }) => {
  const { user, initializing } = useAuth();

  if (initializing) return <FullScreenLoader />;
  if (user) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <Login />
          </RedirectIfAuthed>
        }
      />

      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
