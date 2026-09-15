import RepositorySnapshot from "../models/RepositorySnapshot.js";

import { getRepository } from "./githubService.js";
import { getRecentCommits } from "./commitService.js";
import { getIssues } from "./issueService.js";
import { getPullRequests } from "./pullRequestService.js";
import { getContributors } from "./contributorService.js";
import { getRepositoryFiles } from "./documentationService.js";
import {
  generateRecommendations
} from "../utils/recommendationEngine.js";

import { analyzeActivity } from "../utils/activityAnalyzer.js";
import { analyzeIssues } from "../utils/issueAnalyzer.js";
import { analyzePullRequests } from "../utils/pullRequestAnalyzer.js";
import { analyzeContributors } from "../utils/contributorAnalyzer.js";
import { analyzeDocumentation } from "../utils/documentationAnalyzer.js";
import { calculateHealthScore } from "../utils/healthScorer.js";
import { getCached, setCached } from "../utils/cache.js";

// Analysis results are cached to avoid re-hitting the GitHub API (6+ calls,
// each paginated) on every dashboard interaction.
const ANALYSIS_TTL_MS = 10 * 60 * 1000;

// A new history snapshot is normally only persisted when the most recent one
// for this repo is older than this, so repeated analyses in one sitting don't
// flood the trend chart. Override with SNAPSHOT_INTERVAL_MINUTES (0 = always
// write a new point - handy while testing the trend).
const snapshotIntervalMinutes = Number(
  process.env.SNAPSHOT_INTERVAL_MINUTES
);

const SNAPSHOT_MIN_INTERVAL_MS =
  (Number.isFinite(snapshotIntervalMinutes)
    ? snapshotIntervalMinutes
    : 60) *
  60 *
  1000;

const persistSnapshotIfDue = async (user, owner, repo, repositoryName, health) => {
  const lastSnapshot = await RepositorySnapshot.findOne({ user, owner, repo })
    .sort({ createdAt: -1 })
    .select("createdAt overallScore");

  if (lastSnapshot) {
    const ageMs = Date.now() - lastSnapshot.createdAt.getTime();
    const scoreUnchanged =
      lastSnapshot.overallScore === health.overallScore;

    // Skip only when it's both recent AND identical - a changed score always
    // earns a new point.
    if (ageMs < SNAPSHOT_MIN_INTERVAL_MS && scoreUnchanged) {
      return;
    }
  }

  await RepositorySnapshot.create({
    user,
    owner,
    repo,
    repositoryName,
    overallScore: health.overallScore,
    status: health.status,
    categories: health.categories
  });
};

export const analyzeRepository = async (owner, repo, user) => {
  const cacheKey = `${user}:${owner}/${repo}`.toLowerCase();

  const cached = getCached(cacheKey);

  if (cached) {
    // Still record a history point even when the analysis itself is served
    // from cache, so the trend keeps growing across sessions.
    await persistSnapshotIfDue(
      user,
      owner,
      repo,
      cached.repository.fullName,
      cached.health
    );

    return cached;
  }

  const [
    repository,
    commits,
    issues,
    pullRequests,
    contributors,
    files
  ] = await Promise.all([
    getRepository(owner, repo),
    getRecentCommits(owner, repo),
    getIssues(owner, repo),
    getPullRequests(owner, repo),
    getContributors(owner, repo),
    getRepositoryFiles(owner, repo)
  ]);

  const activity = analyzeActivity(commits);

  const issueHealth = analyzeIssues(issues);

  const pullRequestHealth =
    analyzePullRequests(pullRequests);

  const contributorHealth =
    analyzeContributors(contributors);

  const documentationHealth =
    analyzeDocumentation(files);

  const health = calculateHealthScore({
    activity,
    issueHealth,
    pullRequestHealth,
    contributorHealth,
    documentationHealth
  });

  const recommendations = generateRecommendations({
    activity,
    issueHealth,
    pullRequestHealth,
    contributorHealth,
    documentationHealth
  });

  await persistSnapshotIfDue(user, owner, repo, repository.full_name, health);

  const result = {
    repository: {
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      watchers: repository.watchers_count,
      openIssues: repository.open_issues_count,
      language: repository.language,
      createdAt: repository.created_at,
      updatedAt: repository.updated_at,
      url: repository.html_url
    },

    health,

    recommendations,

    metrics: {
      activity,
      issueHealth,
      pullRequestHealth,
      contributorHealth,
      documentationHealth
    }
  };

  setCached(cacheKey, result, ANALYSIS_TTL_MS);

  return result;
};
