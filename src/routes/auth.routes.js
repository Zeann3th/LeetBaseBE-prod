import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = Router();

router.post("/register", AuthController.register);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/login", AuthController.login);

router.get("/logout", AuthController.logout);

router.get("/refresh", AuthController.refresh);

// Needs user to logged in
router.get("/forgot-password", verifyUser, AuthController.forgotPassword);

router.patch("/reset-password", verifyUser, AuthController.resetPassword);

router.get("/resend-email", verifyUser, AuthController.resendEmail);


export { router as AuthRouter };
