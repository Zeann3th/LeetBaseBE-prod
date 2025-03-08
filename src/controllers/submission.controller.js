import axios from "axios";
import { sanitize, TwoWayMap } from "../utils.js";
import Problem from "../models/Problem.js";
import s3 from "../services/storage.js";
import Submission from "../models/Submission.js";

const languages = new TwoWayMap({
  103: "c",
  105: "cpp",
  107: "go",
  91: "java",
  102: "javascript",
  98: "php",
  100: "python",
});

const getById = async (req, res) => {
  const id = sanitize(req.params.id, "uuid");
  if (!id) {
    return res.status(400).json({ message: "Invalid Submission Id" });
  }
  try {
    const submission = await Submission.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    if (submission.user.toString() !== req.user.sub) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (submission.status === "PENDING") {
      return res.status(202).json({ message: "Submission is pending" });
    }
    return res.status(200).json(submission);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const create = async (req, res) => {
  const problemId = sanitize(req.body.problemId, "mongo");
  const language = sanitize(req.body.language, "string");
  const code = req.body.code; // Base64

  if (!problemId || !language || !code) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  const languageId = languages.revGet(language.toLowerCase());
  if (!languageId) {
    return res.status(400).json({ message: "Invalid programming language" })
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  const template = await s3.getDownloadUrl(`${problemId}/${language.toLowerCase()}`);
  if (!template) {
    return res.status(404).json({ message: "Template not found" });
  }

  const submit = template.replace(/\/\/--code--/g, atob(code));

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
      base64_encoded: 'true',
      wait: 'false',
      fields: '*'
    },
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json"
    },
    data: {
      language_id: languageId,
      source_code: btoa(submit),
      callback_url: `${process.env.RAILWAY_PUBLIC_DOMAIN}/v1/submissions/callback`
    }
  };

  try {
    const { data: { token: submissionId } } = await axios.request(options);
    const submission = await Submission.create({
      submissionId,
      user: req.user.sub,
      problem: problemId,
      language,
    })
    res.status(202).json({ submissionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createCallback = async (req, res) => {
  return res.status(200).json(req.body);
}

const SubmissionController = {
  getById,
  create,
  createCallback,
};

export default SubmissionController;
