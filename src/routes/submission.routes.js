import { Router } from "express";
import SubmissionController from "../controllers/submission.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/sync", verifyAdmin, SubmissionController.syncLanguage);

router.get("/:id", SubmissionController.getById);

router.post("/", SubmissionController.create);

export { router as SubmissionRouter };
