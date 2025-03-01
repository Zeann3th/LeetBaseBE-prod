import { Router } from "express";
import { AuthRouter } from "./auth.routes.js";
import { UserRouter } from "./user.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.use("/auth", AuthRouter);

router.use("/users", UserRouter);

export default router;
