const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let Item = new Schema({
  name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  deleted_at: {
    type: Date,
  },
});
module.exports = mongoose.model("Item", Item);
