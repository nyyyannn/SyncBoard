const Document = require("../models/docs-model");

const createDoc = async (req, res, next) => {
  try {
    const { title } = req.body;

    const newDoc = await Document.create({
      title: title || "Untitled Document",
      content: "",
      owner: req.userID
    });

    res.status(201).json({
      message: "Document created",
      docId: newDoc._id.toString()
    });
  } catch (error) {
    next(error);
  }
};

const getDocById = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: "Document not found" });

    const userId = req.userID.toString();
    const collaborators = Array.isArray(doc.collaborators) ? doc.collaborators : [];

    const isOwner = doc.owner.toString() === userId;
    const isCollaborator = collaborators.map(id => id.toString()).includes(userId);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};

module.exports = { createDoc, getDocById };
