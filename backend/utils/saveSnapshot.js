const Document = require("../models/docs-model");

const saveSnapshot = async(docId,content)=>
{
    const doc = await Document.findById(docId);
    if(!doc)
    {
        const error = new Error("Document not found");
        error.status = 404;
        throw error;
    }
    await Document.findByIdAndUpdate(docId,{
        $push:{
            versions:{
                content,
                savedAt: new Date()
            }
        }
    });
}

module.exports = saveSnapshot;