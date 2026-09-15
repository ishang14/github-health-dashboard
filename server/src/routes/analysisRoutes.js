import express from "express";
import {
  analyzeRepositoryController
} from "../controllers/analysisController.js";

const router = express.Router();

router.get(
  "/:owner/:repo",
  analyzeRepositoryController
);

export default router;