import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { emailLimiter } from "../middlewares/ratelimit.js";

const router = Router();

router.post("/register", AuthController.register);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/login", AuthController.login);

router.get("/github", AuthController.redirectOAuth);

router.get("/github/callback", AuthController.handleOAuthCallback);

router.get("/logout", AuthController.logout);

router.get("/refresh", AuthController.refresh);

router.post("/forgot-password", emailLimiter, AuthController.forgotPassword);

router.post("/reset-password", emailLimiter, AuthController.resetPassword);

router.post("/resend-email", emailLimiter, AuthController.resendEmail);

export { router as AuthRouter };
