import mongoose from "mongoose";

const repositorySnapshotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    owner: {
      type: String,
      required: true
    },

    repo: {
      type: String,
      required: true
    },

    repositoryName: {
      type: String,
      required: true
    },

    overallScore: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      required: true
    },

    categories: {
      activity: Number,
      maintenance: Number,
      issues: Number,
      pullRequests: Number,
      community: Number,
      documentation: Number
    }
  },
  {
    timestamps: true
  }
);

repositorySnapshotSchema.index({
  user: 1,
  owner: 1,
  repo: 1,
  createdAt: -1
});

const RepositorySnapshot =
  mongoose.model(
    "RepositorySnapshot",
    repositorySnapshotSchema
  );

export default RepositorySnapshot;