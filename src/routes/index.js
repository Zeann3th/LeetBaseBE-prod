import { Router } from "express";
import { AuthRouter } from "./auth.routes.js";
import { UserRouter } from "./user.routes.js";
import { ProblemRouter } from "./problem.routes.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.use("/auth", AuthRouter);

router.use("/users", UserRouter);

router.use("/problems", verifyToken, ProblemRouter);

export default router;
