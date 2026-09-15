import mongoose from "mongoose";

import RepositorySnapshot from "../models/RepositorySnapshot.js";

// GET /api/repositories
// One row per analyzed repo, carrying its most recent snapshot.
export const listRepositories = async (req, res) => {
  try {
    const repositories = await RepositorySnapshot.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId) } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { owner: "$owner", repo: "$repo" },
          repositoryName: { $first: "$repositoryName" },
          overallScore: { $first: "$overallScore" },
          status: { $first: "$status" },
          categories: { $first: "$categories" },
          lastAnalyzedAt: { $first: "$createdAt" },
          firstAnalyzedAt: { $last: "$createdAt" },
          snapshotCount: { $sum: 1 }
        }
      },
      { $sort: { lastAnalyzedAt: -1 } },
      {
        $project: {
          _id: 0,
          owner: "$_id.owner",
          repo: "$_id.repo",
          repositoryName: 1,
          overallScore: 1,
          status: 1,
          categories: 1,
          lastAnalyzedAt: 1,
          firstAnalyzedAt: 1,
          snapshotCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      repositories
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to list analyzed repositories"
    });
  }
};

// DELETE /api/repositories/:owner/:repo
// Removes every stored snapshot for a repo.
export const deleteRepository = async (req, res) => {
  try {
    const { owner, repo } = req.params;

    const { deletedCount } = await RepositorySnapshot.deleteMany({
      user: req.userId,
      owner,
      repo
    });

    res.json({
      success: true,
      deletedCount
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete repository history"
    });
  }
};

// DELETE /api/repositories
// Clears all stored history (used by Settings -> danger zone).
export const clearAllRepositories = async (req, res) => {
  try {
    const { deletedCount } = await RepositorySnapshot.deleteMany({
      user: req.userId
    });

    res.json({
      success: true,
      deletedCount
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to clear history"
    });
  }
};
