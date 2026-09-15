import octokit from "../config/github.js";
import { fetchAllPages } from "../utils/githubPagination.js";

export const getContributors = async (owner, repo) => {
  return await fetchAllPages(
    octokit,
    "GET /repos/{owner}/{repo}/contributors",
    {
      owner,
      repo
    }
  );
};