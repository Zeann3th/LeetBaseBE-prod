import Problem from "../models/Problem.js";
import cache from "../services/cache.js";
import { sanitize } from "../utils.js"

const searchProblems = async (req, res) => {
  const term = sanitize(req.params.term, "string");
  if (!term) {
    return res.status(400).send({ message: "Invalid search term" });
  }

  const key = `search:${term}`;

  if (req.headers["Cache-Control"] !== "no-cache") {
    const cached = await cache.get(key);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
  }

  const problems = await Problem.aggregate([
    {
      "$search": {
        "index": "problemsIdx",
        "text": {
          "query": term,
          "path": "title",
          "fuzzy": {}
        }
      }
    }
  ])

  if (!problems) {
    return res.status(404).send({ message: "No problems found" });
  }

  await cache.set(key, JSON.stringify(problems), "EX", 600);
  return res.status(200).send(problems);
}

const searchController = {
  searchProblems,
}

export default searchController;
