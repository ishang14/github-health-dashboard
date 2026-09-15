import express from "express";
import {
  getRepositoryHistory,
  getRecentActivity
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/", getRecentActivity);
router.get("/:owner/:repo", getRepositoryHistory);

export default router;
