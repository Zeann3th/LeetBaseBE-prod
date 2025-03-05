import axios from "axios";
import { isValidId, TwoWayMap } from "../utils.js";

const languages = new TwoWayMap({
  103: "C",
  105: "C++",
  107: "Go",
  91: "Java",
  102: "Javascript",
  98: "PHP",
  100: "Python",
});

const getById = async (req, res) => {
  const { id } = req.params;
  if (isValidId(id) === false) {
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
      "x-rapidapi-key": "",
      "x-rapidapi-host": ""
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
  const { language, code, input } = req.body;
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
      base64_encoded: 'true',
      wait: 'false',
      fields: '*'
    },
    headers: {
      "x-rapidapi-key": "",
      "x-rapidapi-host": "",
      "Content-Type": "application/json"
    },
    data: {
      language_id: languages.revGet(language),
      source_code: btoa(code),
      stdin: btoa(input)
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
