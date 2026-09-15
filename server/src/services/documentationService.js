import octokit from "../config/github.js";

export const getRepositoryFiles = async (owner, repo) => {
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner,
        repo,
        tree_sha: "HEAD",
        recursive: "1"
      }
    );

    return response.data.tree;
  } catch (error) {
    // 404 / 409 => empty repository (no default branch / no HEAD).
    if (error.status === 404 || error.status === 409) {
      return [];
    }

    throw error;
  }
};
