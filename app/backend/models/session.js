const mongoose = require("mongoose");

let Schema = mongoose.Schema({
	ttl:Number,
	token:String,
	userId:String,
	accessLevel:Number,
});

module.exports = mongoose.model("Session", Schema);