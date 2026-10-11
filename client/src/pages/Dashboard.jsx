import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import RepositorySearch from "../components/repository/RepositorySearch";
import RepositoryHeader from "../components/repository/RepositoryHeader";

import HealthScore from "../components/health/HealthScore";
import HealthDimensions from "../components/health/HealthDimensions";
import HealthTrend from "../components/health/HealthTrend";

import MetricCards from "../components/metrics/MetricCards";
import Recommendations from "../components/insights/Recommendations";

import { parseRepoInput } from "../utils/parseRepoInput";

import {
  analyzeRepository,
  getRepositoryHistory
} from "../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const lastRequested = useRef("");
  const requestId = useRef(0);

  const runAnalysis = useCallback(async (owner, repo) => {
    // Lets a superseded or abandoned (browser back) request be ignored.
    const id = ++requestId.current;
    const isStale = () => id !== requestId.current;

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);
      setHistory([]);

      const data = await analyzeRepository(owner, repo);
      if (isStale()) return;
      setAnalysis(data);

      const historyData = await getRepositoryHistory(owner, repo);
      if (isStale()) return;
      setHistory(historyData.history || []);
    } catch (err) {
      if (isStale()) return;
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to analyze repository."
      );
    } finally {
      if (!isStale()) setLoading(false);
    }
  }, []);

  const handleAnalyze = (repoInput) => {
    const parsed = parseRepoInput(repoInput);

    if (!parsed) {
      setError("Enter a repository as owner/repo or a github.com URL.");
      return;
    }

    const key = `${parsed.owner}/${parsed.repo}`;

    // Same repo that's already shown: the URL won't change, so re-run
    // directly instead of relying on the searchParams effect.
    if (key === lastRequested.current) {
      runAnalysis(parsed.owner, parsed.repo);
      return;
    }

    setSearchParams({ owner: parsed.owner, repo: parsed.repo });
  };

  // React to ?owner=&repo= (set by this page, the topbar search, or the
  // Repositories list) and analyze once per unique pair.
  useEffect(() => {
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
      lastRequested.current = "";
      requestId.current++;
      return;
    }

    const key = `${owner}/${repo}`;
    if (key === lastRequested.current) return;

    lastRequested.current = key;
    runAnalysis(owner, repo);
  }, [searchParams, runAnalysis]);

  const activeRepo = searchParams.get("owner")
    ? `${searchParams.get("owner")}/${searchParams.get("repo")}`
    : "";

  // Back to the bare dashboard (e.g. browser back): clear the previous result.
  const [shownRepo, setShownRepo] = useState(activeRepo);
  if (shownRepo !== activeRepo) {
    setShownRepo(activeRepo);
    if (!activeRepo) {
      setAnalysis(null);
      setHistory([]);
      setError("");
      setLoading(false);
    }
  }

  return (
    <>
      <RepositorySearch
        key={activeRepo}
        onAnalyze={handleAnalyze}
        loading={loading}
        initialValue={activeRepo}
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && !analysis && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
          Analyzing {activeRepo || "repository"}…
        </div>
      )}

      {analysis && (
        <>
          <RepositoryHeader repository={analysis.repository} />

          <HealthScore health={analysis.health} />

          <HealthDimensions categories={analysis.health.categories} />

          <MetricCards metrics={analysis.metrics} />

          <HealthTrend history={history} />

          <Recommendations
            recommendations={analysis.recommendations}
          />
        </>
      )}
    </>
  );
};

export default Dashboard;
