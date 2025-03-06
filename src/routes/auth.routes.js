import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", AuthController.register);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/resend-email", AuthController.resendEmail);

router.post("/login", AuthController.login);

router.get("/refresh", AuthController.refresh);

router.patch("/credentials", AuthController.update);

router.get("/logout", AuthController.logout);

export { router as AuthRouter };
