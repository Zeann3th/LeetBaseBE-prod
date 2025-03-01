import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", AuthController.handleRegister);

router.post("/login", AuthController.handleLogin);

router.get("/refresh", AuthController.handleRefresh);

router.get("/logout", AuthController.handleLogout);

export { router as AuthRouter };
