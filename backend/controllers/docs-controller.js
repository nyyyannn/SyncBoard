const Document = require("../models/docs-model");

const createDoc = async (req, res, next) => {
  try {
    const { title } = req.body;

    const existingDoc = await Document.findOne({ title, owner: req.userID });
    if (existingDoc) {
        return res.status(400).json({ message: "You already have a document with this title." });
    }

    const newDoc = await Document.create({
      title: title,
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

    const isOwner = doc.owner.toString() === userId;

    const isCollaborator = doc.collaborators.map(id => id.toString()).includes(userId);

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};

const getAllDocs = async (req, res, next) => {
  try {
    const userId = req.userID;
    const page = parseInt(req.query.page) || 1; // Default to page 1 and parseInt is required cause query params are strings by default
    const limit = 10; // 10 documents per page
    const skip = (page - 1) * limit;

    const titleQuery = req.query.title // gets the title from query params
      ? { title: { $regex: req.query.title, $options: "i" } } // i = case-insensitive
      : {};

    const docs = await Document.find({
      $and: [ //$and is a logical operator that matches documents that satisfy all the specified conditions
        {
          $or: [
            { owner: userId }, //(OR)
            { collaborators: userId }
          ]
        }, //(AND)
        titleQuery //returns documents in which the user is either the owner OR a collaborator AND the title matches the search query
      ]
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(docs);
  } 
  catch (error) {
    next(error);
  }
};


module.exports = { createDoc, getDocById, getAllDocs };
