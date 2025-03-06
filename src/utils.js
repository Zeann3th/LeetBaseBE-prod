import mongoose from "mongoose";

const isProduction = process.env.NODE_ENV === "production";

class TwoWayMap {
  constructor(map) {
    this.map = map;
    this.reverseMap = {};
    for (const key in map) {
      const value = map[key];
      this.reverseMap[value] = key;
    }
  }
  get(key) {
    return this.map[key];
  }
  revGet(key) {
    return this.reverseMap[key];
  }
}

const sanitize = (value, type) => {
  if (value == null) return null;

  value = String(value).trim();

  switch (type) {
    case "string":
      return escapeHtml(value);
    case "number": {
      const num = Number(value);
      return isNaN(num) ? null : num;
    }
    case "boolean":
      return value.toLowerCase() === "true";
    case "uuid":
      return /^[a-zA-Z0-9_-]+$/.test(value) ? value : null;
    case "email":
      return validator.isEmail(value) ? value : null;
    case "mongo":
      return mongoose.Types.ObjectId.isValid(value) ? value : null;
    default:
      return null;
  }
};

const escapeHtml = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


export { isProduction, TwoWayMap, sanitize, escapeHtml };
