import express from "express";
import {
  listRepositories,
  deleteRepository,
  clearAllRepositories
} from "../controllers/repositoryController.js";

const router = express.Router();

router.get("/", listRepositories);
router.delete("/", clearAllRepositories);
router.delete("/:owner/:repo", deleteRepository);

export default router;
