import { Router } from "express";

const router = Router();

router.get("/");

router.get("/:id");

router.get("/profile");

router.patch("/profile");

router.get("/submissions");

export { router as UserRouter };
