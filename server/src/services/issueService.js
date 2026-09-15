import octokit from "../config/github.js";
import { fetchAllPages } from "../utils/githubPagination.js";

export const getIssues = async (owner, repo) => {
  const issues = await fetchAllPages(
    octokit,
    "GET /repos/{owner}/{repo}/issues",
    {
      owner,
      repo,
      state: "all"
    }
  );

  return issues.filter(
    (item) => !item.pull_request
  );
};