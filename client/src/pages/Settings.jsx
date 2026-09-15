import { useState } from "react";
import {
  Save,
  RotateCcw,
  Plug,
  Trash2,
  Info,
  CheckCircle2,
  XCircle
} from "lucide-react";

import {
  getApiBaseUrl,
  setApiBaseUrl,
  getRecentActivity,
  clearAllHistory,
  DEFAULT_API_BASE_URL
} from "../services/api";

const DEFAULT_BASE_URL = DEFAULT_API_BASE_URL;

const Settings = () => {
  const [baseUrl, setBaseUrl] = useState(getApiBaseUrl());
  const [saved, setSaved] = useState(false);
  const [testState, setTestState] = useState(null); // null | "testing" | "ok" | "fail"
  const [clearState, setClearState] = useState("");

  const handleSave = () => {
    setApiBaseUrl(baseUrl);
    setBaseUrl(getApiBaseUrl());
    setSaved(true);
    setTestState(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setApiBaseUrl("");
    setBaseUrl(getApiBaseUrl());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTestState("testing");
    try {
      await getRecentActivity(1);
      setTestState("ok");
    } catch {
      setTestState("fail");
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Permanently delete ALL stored analyses for every repository?"
      )
    ) {
      return;
    }

    try {
      setClearState("clearing");
      const data = await clearAllHistory();
      setClearState(`Deleted ${data.deletedCount ?? 0} snapshots.`);
    } catch (err) {
      setClearState(
        err.response?.data?.message ||
          err.message ||
          "Failed to clear history."
      );
    }
  };

  return (
    <section className="max-w-2xl space-y-6">
      {/* API connection */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Plug size={17} className="text-zinc-400" />
          <h2 className="text-sm font-semibold text-white">API Connection</h2>
        </div>

        <label className="block text-xs font-medium text-zinc-500">
          Backend base URL
        </label>
        <input
          value={baseUrl}
          onChange={(event) => setBaseUrl(event.target.value)}
          placeholder={DEFAULT_BASE_URL}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
        />
        <p className="mt-2 text-xs text-zinc-600">
          Stored in this browser only. Default: {DEFAULT_BASE_URL}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            <Save size={14} />
            Save
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            <RotateCcw size={14} />
            Reset to default
          </button>
          <button
            onClick={handleTest}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Test connection
          </button>

          {saved && (
            <span className="text-xs font-medium text-emerald-400">
              Saved
            </span>
          )}
          {testState === "testing" && (
            <span className="text-xs text-zinc-500">Testing…</span>
          )}
          {testState === "ok" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
              <CheckCircle2 size={13} /> Reachable
            </span>
          )}
          {testState === "fail" && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
              <XCircle size={13} /> Unreachable
            </span>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Trash2 size={17} className="text-red-400" />
          <h2 className="text-sm font-semibold text-white">Danger Zone</h2>
        </div>

        <p className="text-sm text-zinc-400">
          Remove every stored snapshot from the database. Trend charts and the
          Repositories list will be emptied. This cannot be undone.
        </p>

        <button
          onClick={handleClearAll}
          disabled={clearState === "clearing"}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-950/70 disabled:opacity-50"
        >
          <Trash2 size={14} />
          {clearState === "clearing" ? "Clearing…" : "Clear all history"}
        </button>

        {clearState && clearState !== "clearing" && (
          <p className="mt-3 text-xs text-zinc-400">{clearState}</p>
        )}
      </div>

      {/* About */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Info size={17} className="text-zinc-400" />
          <h2 className="text-sm font-semibold text-white">About</h2>
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">App</dt>
            <dd className="text-zinc-300">GitHealth Dashboard</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Health dimensions</dt>
            <dd className="text-zinc-300">
              Activity, Maintenance, Issues, PRs, Community, Docs
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Analysis cache</dt>
            <dd className="text-zinc-300">10 minutes (server-side)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">New trend point</dt>
            <dd className="text-zinc-300">on score change or interval</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Settings;
