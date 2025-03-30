import { Router } from "express";
import commentController from "../controllers/comment.controller.js";

const router = Router();

router.post("/vote", commentController.vote);

router.get("/:id", commentController.getById);

router.post("/", commentController.create);

router.patch("/:id", commentController.update);

router.delete("/:id", commentController.remove);

export { router as commentRouter };
