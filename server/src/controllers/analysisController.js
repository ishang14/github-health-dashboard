import { analyzeRepository } from "../services/analysisService.js";

export const analyzeRepositoryController = async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const analysis = await analyzeRepository(owner, repo, req.userId);

    res.json({
      success: true,
      ...analysis
    });
  } catch (error) {
    console.error(error);

    // Surface GitHub API failures (404 repo not found, 403 rate limit, etc.)
    // instead of collapsing everything into a generic 500.
    const status = Number.isInteger(error.status) ? error.status : 500;

    const messages = {
      403: "GitHub API rate limit reached or access forbidden. Try again later.",
      404: "Repository not found. Check the owner and repository name.",
      422: "GitHub could not process the request for this repository."
    };

    res.status(status).json({
      success: false,
      message:
        messages[status] || "Unable to analyze repository"
    });
  }
};
