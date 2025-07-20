/*Jobs is a naming convention for folders that run in the background */

/*Cron is used to periodically save document content for versioning and recovery and used mainly for rollback, undo, backups */

const cron = require('node-cron');
const Document = require('../models/docs-model');
const saveSnapshot = require('../utils/saveSnapshot');

cron.schedule("*/2 * * * *", async ()=> /* saves every 2 minutes */
{
    try{
        const docs = await Document.find({
            $or:[ //executing an or of the following 2 statements, either one must be try to run.
                { lastSnapshotAt: { $exists: false} }, //if its a new document and the lastSnapShot field does not exist
                { $expr: { $gt: ["$updatedAt", "$lastSnapshotAt"] } } // $gt is for greater than and checks if updatedAt is greater than lastSnapShot
            ]
        }).select("_id"); /*find only the required document. VERY IMPORTANT!*/

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