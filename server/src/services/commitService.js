import octokit from "../config/github.js";

export const getRecentCommits = async (owner, repo) => {
  const since = new Date();

  since.setDate(since.getDate() - 30);

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/commits",
    {
      owner,
      repo,
      since: since.toISOString(),
      per_page: 100
    }
  );

  return response.data;
};