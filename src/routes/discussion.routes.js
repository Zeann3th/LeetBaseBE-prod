import { Router } from "express";
import discussionController from "../controllers/discussion.controller.js";

const router = Router();

router.get("/", discussionController.getAll)

router.get("/search", discussionController.search)

router.post("/vote", discussionController.vote)

router.get("/:id", discussionController.getById)

router.post("/", discussionController.create)

router.patch("/:id", discussionController.update)

router.delete("/:id", discussionController.remove)

export { router as discussionRouter };
