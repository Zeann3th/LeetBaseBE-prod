import { Router } from "express";
import SubmissionController from "../controllers/submission.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = Router();

router.get("/:id", verifyUser, SubmissionController.getById);

router.post("/", verifyUser, SubmissionController.create);

router.put("/callback", SubmissionController.createCallback);

export { router as SubmissionRouter };
