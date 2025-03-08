import axios from "axios";
import { sanitize, TwoWayMap } from "../utils.js";
import Problem from "../models/Problem.js";
import s3 from "../services/storage.js";

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

  const options = {
    method: "GET",
    url: `https://judge0-ce.p.rapidapi.com/submissions/${id}`,
    params: {
      base64_encoded: "true",
      fields: "*"
    },
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
    }
  };

  try {
    const { data } = await axios.request(options);
    //TODO: Add entry to submissions collection and return the entry
    return res.status(200).json(data);
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
    }
  };

  try {
    const { data: { token: submissionId } } = await axios.request(options);
    res.status(202).json({ submissionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

const SubmissionController = {
  getById,
  create
};

export default SubmissionController;
