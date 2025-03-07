import { Router } from "express";
import { verifyUser } from "../middlewares/auth.js";
import { AuthRouter } from "./auth.routes.js";
import { UserRouter } from "./user.routes.js";
import { ProblemRouter } from "./problem.routes.js";
import { SubmissionRouter } from "./submission.routes.js";
import { SearchRouter } from "./search.routes.js";

const router = Router();

router.use("/auth", AuthRouter);

router.use("/users", verifyUser, UserRouter);

router.use("/problems", verifyUser, ProblemRouter);

router.use("/submissions", verifyUser, SubmissionRouter);

router.use("/search", verifyUser, SearchRouter);

export default router;
