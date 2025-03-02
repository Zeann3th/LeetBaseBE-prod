import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", AuthController.handleRegister); // Email service needed

router.get("/verify-email", AuthController.handleVerifyEmail);

router.post("/resend-email", AuthController.handleResendEmail); // Email service needed

router.post("/login", AuthController.handleLogin);

router.get("/refresh", AuthController.handleRefresh);

router.patch("/credentials");

router.get("/logout", AuthController.handleLogout);

export { router as AuthRouter };
