import SubmissionController from "../controllers/submission.controller.js";

const { Router } = require("express");

const router = Router();

router.get("/:id", SubmissionController.getById);

router.post("/", SubmissionController.create);

export { router as SubmissionRouter };
