import { Router } from "express"
import SearchController from "../controllers/search.controller.js"

const router = Router()

router.get("/:term", SearchController.searchProblems)

router.get("/:term/autocomplete", SearchController.autocompleteSearchProblems)

export { router as SearchRouter }
