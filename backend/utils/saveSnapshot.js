const Document = require("../models/docs-model");

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

module.exports = saveSnapshot;