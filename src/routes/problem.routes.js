import { Router } from "express";
import ProblemController from "../controllers/problem.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = Router();

router.get("/", ProblemController.getAll)

router.get("/:id", ProblemController.getById)

router.post("/", verifyAdmin, ProblemController.create)

router.post("/:id/upload", verifyAdmin, ProblemController.getUploadUrl)

router.patch("/:id", verifyAdmin, ProblemController.update)

router.delete("/:id", verifyAdmin, ProblemController.remove)

export { router as ProblemRouter };
