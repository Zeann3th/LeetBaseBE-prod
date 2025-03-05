import { Router } from "express";
import { AuthRouter } from "./auth.routes.js";
import { UserRouter } from "./user.routes.js";
import { ProblemRouter } from "./problem.routes.js";
import { SubmissionRouter } from "./submission.routes.js";
import { verifyCsrf, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.use("/auth", AuthRouter);

router.use("/users", verifyToken, verifyCsrf, UserRouter);

router.use("/problems", verifyToken, verifyCsrf, ProblemRouter);

router.use("/submissions", verifyToken, verifyCsrf, SubmissionRouter);

export default router;
