import Problem from "../models/Problem.js";
import cache from "../services/cache.js";
import { sanitize } from "../utils.js";

const getAll = async (req, res) => {
  const limit = sanitize(req.query.limit, "number") || 10;
  const page = sanitize(req.query.page, "number") || 1;

  const key = `problems:${limit}:${page}`;

  try {
    if (req.headers["Cache-Control"] !== "no-cache") {
      const cachedProblems = await cache.get(key);
      if (cachedProblems) {
        return res.status(200).json(JSON.parse(cachedProblems));
      }
    }

    const problems = await Problem.find().limit(limit).skip((page - 1) * limit);
    await cache.set(key, JSON.stringify(problems), "EX", 600);

    return res.status(200).json(problems);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const getById = async (req, res) => {
  const id = sanitize(req.params.id, "mongo");
  if (!id) {
    return res.status(400).json({ message: "Missing path id" });
  }

  const key = `problem:${id}`;

  try {
    if (req.headers["Cache-Control"] !== "no-cache") {
      const cachedProblem = await cache.get(key);
      if (cachedProblem) {
        return res.status(200).json(JSON.parse(cachedProblem));
      }
    }

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    await cache.set(key, JSON.stringify(problem), "EX", 600);

    return res.status(200).json(problem);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const create = async (req, res) => {
  const { title, description, difficulty, tags, testCases } = req.body;

  if (!title || !description || !difficulty || !tags || !testCases || !Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  const existingProblem = await Problem.findOne({ title: { $eq: title } });
  if (existingProblem) {
    return res.status(409).json({ message: "Problem already exists" });
  }

  try {
    await Problem.create({
      title,
      description,
      difficulty,
      tags,
      testCases
    })
    return res.status(201).json({ message: "Problem created successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

const update = async (req, res) => {
  const id = sanitize(req.params.id, "mongo");
  if (!id) {
    return res.status(400).json({ message: "Missing path id" });
  }

  const { title, description, difficulty, tags, testCases } = req.body;

  const request = {
    ...(title && { title }),
    ...(description && { description }),
    ...(difficulty && { difficulty }),
    ...(Array.isArray(tags) && tags.length > 0 && { tags }),
    ...(testCases && { testCases }),
  };

  if (Object.keys(request).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update" });
  }

  if (title) {
    const existingProblem = await Problem.findOne({ title: { $eq: title } });
    if (existingProblem && existingProblem._id.toString() !== id) {
      return res.status(409).json({ message: "Problem with this title already exists" });
    }
  }

  try {
    const updatedProblem = await Problem.findByIdAndUpdate(id, request, { new: true });
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.status(200).json(updatedProblem);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  const id = sanitize(req.params.id, "mongo");
  if (!id) {
    return res.status(400).json({ message: "Missing path id" });
  }

  const problem = await Problem.findByIdAndDelete(id);

  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  await cache.del(`problem:${id}`);
  return res.status(204).send();
}

const ProblemController = {
  getAll,
  getById,
  create,
  update,
  remove
}

export default ProblemController;
