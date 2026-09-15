import octokit from "../config/github.js";

export const getRepository = async (owner, repo) => {
  const response = await octokit.request(
    "GET /repos/{owner}/{repo}",
    {
      owner,
      repo
    }
  );

  return response.data;
};