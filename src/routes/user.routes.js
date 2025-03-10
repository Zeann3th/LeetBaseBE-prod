import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/", userController.getAll);

router.get("/:id", userController.getById);

router.get("/profile", userController.getProfile);

router.patch("/profile", userController.update);

router.get("/submissions", userController.getSubmissionHistory);

export { router as userRouter };
