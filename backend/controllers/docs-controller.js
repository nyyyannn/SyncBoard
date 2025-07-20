const Document = require("../models/docs-model");
const User = require("../models/user-model");
const hasAccess = require("../utils/hasAccess");

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
    const doc = await Document.findById(req.params.id).select("-versions"); //removing lengthy versions array

    if (!doc) return res.status(404).json({ message: "Document not found" });

    if(!hasAccess(req.userID,doc))
      return res.status(403).json({message:"Access denied"});

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

    const filter = {
      $or:[{owner: userId},{collaborators: userId}],
    };

    if(req.query.title){
      filter.title = {$regex: req.query.title, $options: "i"}; //i=case-insensitive
    }

    const [docs, totalDocs] = await Promise.all([
      Document.find(filter)
      .sort({updatedAt: -1})
      .skip(skip)
      .limit(limit)
      .select("_id title owner updatedAt collaborators"),
      Document.countDocuments(filter),
    ])

    res.status(200).json({
      documents: docs,
      currentPage: page,
      totalPages: Math.ceil(totalDocs/limit),
    })
  } 
  catch (error) {
    next(error);
  }
};

const inviteCollaborator = async (req,res,next) =>
{
  try{
    const docId = req.params.id;
    const {collaboratorEmail} = req.body;
    const requesterId = req.userID;
  
    const userToAdd = await User.findOne({email:collaboratorEmail});
    if(!userToAdd) return res.status(404).json({message: "User not found"});

    if(userToAdd._id.toString() === requesterId){
      return res.status(400).json({message: "You cannot invite yourself."});
    }

    const updatedDoc = await Document.findOneAndUpdate(
      { _id: docId, owner: requesterId }, // to check if the doc exists and the owner is the requesterID
      { $addToSet: { collaborators: userToAdd._id } }, //add to a set (to ensure no duplicates)
      { new: true } // Options: Return the updated document
    );
    
    if(!updatedDoc){
      return res.status(404).json({message: "Document not found or you are not the owner"});
    }

    res.status(200).json({message:"Collaborator invited successfully"});
  }
  catch (error) {
    next(error);
  }
}

const deleteDocById = async(req,res,next) =>
{
    try
    {
      const docId = req.params.id;
      const userId = req.userID;

    const result  = await Document.findOneAndDelete({_id:docId, owner:userId});
    
    if(!result){
      return res.status(404).json({
        message: "Document not found or you do not have permission to delete it"
      });
    }
      
      return res.status(200).json({message: "Document deleted Successfully"});
    }
    catch(error)
    {
        next(error);
    }
}

const getDocVersions = async(req, res, next) =>
{
  try
  {
    const docId=req.params.id;
    const doc=await Document.findById(docId).select("versions owner collaborators");

    if(!doc)
      return res.status(404).json({message:"Document not found"});

    if(!hasAccess(req.userID,doc)){
      return res.status(403).json({message: "Access Denied"});
    }

    const versions = doc.versions.sort((a,b)=>b.savedAt-a.savedAt).slice(0,20);/*reverse order*/

    res.status(200).json(versions);

  }
  catch(error)
  {
    next(error);
  }
}


const saveSnapshot = async (docId) => {
    try {
        //get doc to access current content
        const docToSave = await Document.findById(docId).select('content');

        if (!docToSave) {
            return;
        }

        const newVersion = {
            content: docToSave.content,
            savedAt: new Date()
        };

        // Performing single, atomic update for maximum efficieny
        await Document.updateOne(
            { _id: docId }, // Find the document by its ID
            {
                $push: {
                    versions: {
                        $each: [newVersion],
                        $sort: { savedAt: -1 }, // Sort by date, newest first
                        $slice: 20              // Keep only the top 20
                    }
                },
                $set: {
                    lastSnapshotAt: new Date()
                }
            }
        );
    } catch (error) {
        console.error(`Error saving snapshot for doc ${docId}:`, error);
    }
};


module.exports = { createDoc, getDocById, saveSnapshot, getAllDocs,inviteCollaborator,deleteDocById, getDocVersions };
