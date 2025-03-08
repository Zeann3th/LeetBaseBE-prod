import { Router } from "express"
import SearchController from "../controllers/search.controller.js"

const router = Router()

router.get("/:term", SearchController.searchProblems)

// TODO: Search by tags, search users?

export { router as SearchRouter }
