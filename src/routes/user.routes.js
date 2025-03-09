import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const router = Router();

router.get("/", UserController.getAll);

router.get("/:id", UserController.getById);

router.get("/profile", UserController.getProfile);

router.patch("/profile", UserController.update);

router.get("/submissions", UserController.getSubmissionHistory);

export { router as UserRouter };
