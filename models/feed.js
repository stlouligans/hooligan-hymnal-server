var mongoose = require("mongoose");
var feedItemSchema = require("./schemas/feedItemSchema");

module.exports = mongoose.model("feed", feedItemSchema);
