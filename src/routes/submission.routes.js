import { Router } from "express";
import SubmissionController from "../controllers/submission.controller.js";

const router = Router();

router.get("/:id", SubmissionController.getById);

router.post("/", SubmissionController.create);

export { router as SubmissionRouter };
