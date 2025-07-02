const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const documentSchema = Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: "Untitled Document"
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
  ]
}, { timestamps: true });

const Document = model("Document", documentSchema);
module.exports = Document;
