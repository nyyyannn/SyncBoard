/*Jobs is a naming convention for folders that run in the background */

/*Cron is used to periodically save document content for versioning and recovery and used mainly for rollback, undo, backups */

const cron = require('node-cron');
const Document = require('../models/docs-model');
const saveSnapshot = require('../utils/saveSnapshot');

cron.schedule("*/2 * * * *", async ()=> /* saves every 2 minutes */
{
    try{
        const docs = await Document.find({
            $or:[
                { lastSnapshotAt: { $exists: false} },
                { $expr: { $gt: ["$updatedAt", "$lastSnapshotAt"] } }
            ]
        }).select("_id"); /*find all docs*/

        if(docs.length===0)
        {
            return;
        }

        for(const doc of docs)
        {
            await saveSnapshot(doc._id,doc.content); /*saving the content in the db*/
        }
    }
    catch(err)
    {
        console.error("Cron failed",err);
    }
})