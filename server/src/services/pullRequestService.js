import octokit from "../config/github.js";
import { fetchAllPages } from "../utils/githubPagination.js";

export const getPullRequests = async (owner, repo) => {
  return await fetchAllPages(
    octokit,
    "GET /repos/{owner}/{repo}/pulls",
    {
      owner,
      repo,
      state: "all"
    }
  );
};