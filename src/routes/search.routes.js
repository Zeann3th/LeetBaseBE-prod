import { Router } from "express"
import searchController from "../controllers/search.controller.js"

const router = Router()

router.get("/:term", searchController.searchProblems)

// TODO: Search by tags, search users?

export { router as searchRouter }
