import axios from "axios";
import { sanitize } from "../utils.js";
import Problem from "../models/Problem.js";
import s3 from "../services/storage.js";
import Submission from "../models/Submission.js";
import Language from "../models/Language.js";

const getById = async (req, res) => {
  const id = sanitize(req.params.id, "mongo");
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
  const code = req.body.code;

  if (!problemId || !language || !code) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  try {
    const [problem, template, existLanguage] = await Promise.all([
      Problem.findById(problemId),
      s3.getDownloadUrl(`${problemId}/${language.toLowerCase()}`),
      Language.findOne({ name: { $eq: language } }),
    ]);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (!existLanguage) {
      return res.status(404).json({ message: "Language not found" });
    }

    const submit = template.replace(/\/\/--code--/g, code);

    const options = {
      method: 'POST',
      url: 'https://emkc.org/api/v2/piston/execute',
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        language: existLanguage.name,
        version: existLanguage.version,
        files: [
          { content: submit }
        ]
      }
    };

    const start = performance.now();
    const { data: { run, compile } } = await axios.request(options);
    const end = performance.now();

    const submission = await Submission.create({
      user: req.user.sub,
      problem: problemId,
      language,
      status: compile?.stderr
        ? "COMPILE_ERROR"
        : run?.stderr
          ? "WRONG_ANSWER"
          : "ACCEPTED",
      error: compile?.stderr || run?.stderr || null,
      runtime: end - start,
    });
    return res.status(200).json(submission);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const syncLanguage = async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://emkc.org/api/v2/piston/runtimes',
    };
    const { data } = await axios.request(options);

    const languageMap = {
      'go': 'go',
      'javascript': 'javascript',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'python': 'python',
      'php': 'php'
    };

    const allowedLanguages = Object.keys(languageMap);

    const languages = data
      .filter(rt => allowedLanguages.includes(rt.language))
      .map(({ language, version }) => {
        const name = languageMap[language];
        if (!name) return null;
        return {
          updateOne: {
            filter: { name },
            update: { $set: { version } },
            upsert: true
          }
        };
      })
      .filter(Boolean);

    if (languages.length > 0) {
      await Language.bulkWrite(languages);
    }

    return res.status(200).json({ message: "Languages synced successfully" });
  } catch (error) {
    console.error("Error syncing languages:", error);
    return res.status(500).json({ message: error.message });
  }
};

const SubmissionController = {
  getById,
  create,
  syncLanguage,
};

export default SubmissionController;
