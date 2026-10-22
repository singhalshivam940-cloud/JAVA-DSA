
const mongoose = require("mongoose");

const revisionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Revision", revisionSchema);
