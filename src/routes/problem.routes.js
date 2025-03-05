import { Router } from "express";
import ProblemController from "../controllers/problem.controller.js";
import { verifyAdmin, verifyCsrf } from "../middlewares/auth.js";

const router = Router();

router.get("/", ProblemController.getAll)

router.get("/:id", ProblemController.getById)

router.post("/", verifyAdmin, verifyCsrf, ProblemController.create)

router.patch("/:id", verifyAdmin, verifyCsrf, ProblemController.update)

router.delete("/:id", verifyAdmin, verifyCsrf, ProblemController.remove)

export { router as ProblemRouter };
