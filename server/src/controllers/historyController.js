import RepositorySnapshot from "../models/RepositorySnapshot.js";

// GET /api/history/:owner/:repo
export const getRepositoryHistory = async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const snapshots = await RepositorySnapshot.find({
      user: req.userId,
      owner,
      repo
    })
      .sort({ createdAt: 1 })
      .limit(30)
      .select(
        "overallScore status categories createdAt"
      );

    res.json({
      success: true,
      history: snapshots
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch repository history"
    });
  }
};

// GET /api/history
// Most recent snapshots across every repo - a global activity feed.
export const getRecentActivity = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);

    const snapshots = await RepositorySnapshot.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(
        "owner repo repositoryName overallScore status createdAt"
      );

    res.json({
      success: true,
      activity: snapshots
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch recent activity"
    });
  }
};
