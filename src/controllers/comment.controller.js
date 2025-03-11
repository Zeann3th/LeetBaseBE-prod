import Comment from "../models/Comment.js";
import Discussion from "../models/Discussion.js";
import { sanitize } from "../utils.js";

const getById = async (req, res) => {
  const id = sanitize(req.params.id, "mongo");
  if (!id) {
    return res.status(400).json({ message: "Missing path id" });
  }
  try {
    const comment = await Comment.findById(id).populate("author")
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const create = async (req, res) => {
  const { content, parentNode } = req.body;
  if (!content || !parentNode) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  try {
    let [parentType, parentId] = parentNode.split("/");
    if (parentType !== "discussion" && parentType !== "comment") {
      return res.status(400).json({ message: "Invalid parent type" });
    }

    parentId = sanitize(parentId, "mongo");
    if (!parentId) {
      return res.status(400).json({ message: "Invalid parent id" });
    }

    const comment = await Comment.create({
      content, author: req.user.sub
    })

    let discussion, parentComment;
    if (parentType === "discussion") {
      discussion = await Discussion.findByIdAndUpdate(parentId, { $push: { comments: comment._id } });
    } else {
      parentComment = await Comment.findByIdAndUpdate(parentId, { $push: { replies: comment._id } });
    }

    if (!discussion && !parentComment) {
      comment.deleteOne();
      return res.status(404).json({ message: "Parent not found" });
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const update = async (req, res) => {
  const id = sanitize(req.params.id, "mongo");
  if (!id) {
    return res.status(400).json({ message: "Missing path id" });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Missing required fields in payload" });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.sub && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const remove = async (req, res) => {
  const id = sanitize(req.params.id, "mongo");
  if (!id) {
    return res.status(400).json({ message: "Missing path id" });
  }

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.sub && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await comment.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const commentController = {
  getById,
  create,
  update,
  remove
}

export default commentController;
