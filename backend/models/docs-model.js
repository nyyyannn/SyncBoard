const mongoose = require("mongoose");
const { Schema } = mongoose;

const versionSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
});

const docSchema = new Schema({
    title: {
        type: String,
        required: [true, "Document title is required."],
        trim: true // Automatically remove leading/trailing whitespace
    },
    content: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Creates a link to the User model
        required: true,
        index: true // for faster lookups
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    versions: [versionSchema]
}, {
    timestamps: true // Automatically manage createdAt and updatedAt
});

const Document = mongoose.model("Document", docSchema);
module.exports = Document;