const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const documentSchema = Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    default: ""
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:[]
    }
  ],
  versions: [
    {
      content: {type: String},
      savedAt: {type: Date, default: Date.now}
    }
  ]
}, { timestamps: true });

const Document = model("Document", documentSchema);
module.exports = Document;
